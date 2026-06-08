import { Injectable } from "@nestjs/common";
import { storageApproachEnum, uploadApproachEnum } from "src/common/enum/multer.enum";
import type { IUser } from "src/common/interface/user.interface";
import { UserRepo } from "src/common/repo/user.repo";
import { S3Service } from "src/common/services/s3.service";

@Injectable()
export class UserService {
    constructor(private readonly s3Service: S3Service, private readonly UserRepo: UserRepo) { }

    profile(user: IUser) {
        return user;
    }

    async profileImage(
        user: IUser,
        file: Express.Multer.File
    ) {
        const oldPath = user.profileImage as string || "";

        if (oldPath) {
            await this.s3Service.deleteFile({
                Key: oldPath
            });
        }

        const profile = await this.UserRepo.findById(user._id);

        if (!profile) {
            throw new Error("User not found");
        }

        const key = await this.s3Service.uuploadFile({
            file,
            path: `${user._id}/profile-images`
        });

        profile.profileImage = key as string;

        await profile.save();

        return {
            message: "Profile image updated successfully",
            profileImage: key
        };
    }
}