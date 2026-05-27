import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseRepo } from "./base.repo";
import { User } from "src/DB/User/user.model";
import { Injectable } from "@nestjs/common";
import { Otp } from "src/DB/OTP/otp.model";

@Injectable()
export class OtpRepo extends BaseRepo<Otp> {
    constructor(
        @InjectModel(Otp.name)
        protected readonly otpModel: Model<Otp>
    ) {
        super(otpModel);
    }
}