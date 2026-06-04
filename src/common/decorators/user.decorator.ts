import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { HydratedDocument } from "mongoose";
import { IUser } from "../interface/user.interface";

export const User = createParamDecorator(
    (data: keyof IUser | undefined, context: ExecutionContext) => {
        let user!: HydratedDocument<IUser>;

        switch (context.getType()) {
            case "http":
                user = context.switchToHttp().getRequest().credentials.user;
                break;

            default:
                return null;
        }

        return user;
    }
);