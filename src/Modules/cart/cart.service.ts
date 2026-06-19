import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { removeItemsFromCartDto, UpdateCartDto } from './dto/update-cart.dto';
import { IUser } from 'src/common/interface/user.interface';
import { cartRepo } from 'src/common/repo/cart.repo';
import { productRepo } from 'src/common/repo/product.repo';
import { match } from 'assert/strict';
import { Types } from 'mongoose';

@Injectable()
export class CartService {
  constructor(
    private readonly cartRepo: cartRepo,
    private readonly productRepo: productRepo
  ) { }
  async create({ productId, quantity }: CreateCartDto, user: IUser) {
    const product = await this.productRepo.findById(productId as unknown as string);
    if (!product) throw new NotFoundException('Product not found');
    let cart = await this.cartRepo.findOne({ userId: user._id });
    if (!cart) return await this.cartRepo.create({
      userId: (user._id),
      products: [{
        productId,
        quantity
      }]
    })

    let match: boolean = false
    for (const cartProduct of cart.products) {
      if (cartProduct.productId.toString() === productId.toString()) {
        cartProduct.quantity += quantity;
        match = true;
        break;
      }
    }

    if (!match && quantity > 0) {
      cart.products.push({
        productId,
        quantity,
      });
    }

    cart.products = cart.products.filter((item) => item.quantity > 0);

    if (cart.products.length === 0) {
      await cart.deleteOne();
      return {
        message: 'Cart deleted successfully',
      };
    }

    return await cart.save();
  }

  async removeItemsFromCart(
    dto: removeItemsFromCartDto,
    user: IUser,
  ) {
    console.log(dto);
    const ids = dto.productIds.map(
      (id) => new Types.ObjectId(id),
    );

    const cart = await this.cartRepo.findOneAndUpdate(
      { userId: user._id },
      {
        $pull: {
          products: {
            productId: {
              $in: ids,
            },
          },
        },
      },
      { new: true },
    );

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    return cart;
  }

  async deleteCart(user: IUser) {
    const cart = await this.cartRepo.findOneAndDelete({ userId: user._id });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }
    return {
      message: 'Cart deleted successfully',
    };
  }

  async getCart(user: IUser) {
    const cart = await this.cartRepo.findOne({ userId: user._id });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const productIds = cart.products.map((item) => item.productId);

    const products = await this.productRepo.find({
      _id: { $in: productIds },
    });

    const productMap = new Map(
      products.map((p) => [p._id.toString(), p]),
    );

    console.log(productMap);
    

    return {
      _id: cart._id,
      userId: cart.userId,
      products: cart.products.map((item) => ({
        product: productMap.get(item.productId.toString()),
        quantity: item.quantity,
      })),
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
    };
  }
}
