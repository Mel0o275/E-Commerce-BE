import { Injectable } from "@nestjs/common";

@Injectable()
export class UserService {
    constructor() {
        
    }

    profile() {
        return {
            id: 1,
            username: "Melo"
        }
    }
}