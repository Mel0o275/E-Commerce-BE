import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCopounDto } from './dto/create-copoun.dto';
import { UpdateCopounDto } from './dto/update-copoun.dto';
import { IUser } from 'src/common/interface/user.interface';
import { copounRepo } from 'src/common/repo/copoun.repo';
import { CopounType } from 'src/common/enum/copoun.enum';

@Injectable()
export class CopounService {
  constructor(
    private readonly copounRepo: copounRepo
  ) { }
  async create({ copounType, copounUsage, endDate, name, startDate, amount, percentage }: CreateCopounDto, user: IUser) {
    const existName = await this.copounRepo.findOne({ name });

    if (existName)
      throw new ConflictException('Copoun name already exists');

    if (copounType === CopounType.Amount && amount == null)
      throw new ConflictException(
        'Amount is required for amount copoun type',
      );

    if (copounType === CopounType.Percentage && percentage == null)
      throw new ConflictException(
        'Percentage is required for percentage copoun type',
      );

    return await this.copounRepo.create({
      name,
      copounType,
      copounUsage,
      startDate,
      endDate,
      amount: copounType === CopounType.Amount ? amount : undefined,
      percentage:
        copounType === CopounType.Percentage ? percentage : undefined,
      createdBy: user._id,
      updatedBy: user._id,
    });
  }

  async findAll() {
    return await this.copounRepo.find({
      isDeleted: false,
    });
  }

  async update(
    id: string,
    updateCopounDto: UpdateCopounDto,
    user: IUser,
  ) {
    const copoun = await this.copounRepo.findById(id);

    if (!copoun || copoun.isDeleted) {
      throw new NotFoundException('Copoun not found');
    }

    if (
      updateCopounDto.name &&
      updateCopounDto.name !== copoun.name
    ) {
      const existName = await this.copounRepo.findOne({
        name: updateCopounDto.name,
      });

      if (existName) {
        throw new ConflictException('Copoun name already exists');
      }
    }

    const finalCopounType =
      updateCopounDto.copounType ?? copoun.copounType;

    const finalAmount =
      updateCopounDto.amount ?? copoun.amount;

    const finalPercentage =
      updateCopounDto.percentage ?? copoun.percentage;

    const finalStartDate =
      updateCopounDto.startDate ?? copoun.startDate;

    const finalEndDate =
      updateCopounDto.endDate ?? copoun.endDate;

    if (
      new Date(finalStartDate).getTime() >=
      new Date(finalEndDate).getTime()
    ) {
      throw new ConflictException(
        'startDate must be before endDate',
      );
    }

    if (
      finalCopounType === CopounType.Amount &&
      finalAmount == null
    ) {
      throw new ConflictException(
        'Amount is required for amount copoun type',
      );
    }

    if (
      finalCopounType === CopounType.Percentage &&
      finalPercentage == null
    ) {
      throw new ConflictException(
        'Percentage is required for percentage copoun type',
      );
    }

    const updateData: any = {
      ...updateCopounDto,
      updatedBy: user._id,
    };

    if (finalCopounType === CopounType.Amount) {
      updateData.amount = finalAmount;
      updateData.$unset = { percentage: 1 };
    } else {
      updateData.percentage = finalPercentage;
      updateData.$unset = { amount: 1 };
    }

    return await this.copounRepo.findByIdAndUpdate(
      id,
      updateData,
      { new: true },
    );
  }

  async remove(id: string, user: IUser) {
    const copoun = await this.copounRepo.findById(id);

    if (!copoun || copoun.isDeleted)
      throw new NotFoundException('Copoun not found');

    return await this.copounRepo.findByIdAndUpdate(id, {
      isDeleted: true,
      updatedBy: user._id,
    });
  }
}
