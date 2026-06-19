import { SetMetadata } from "@nestjs/common";

export const ttlName = "CacheTTL";
export const ttl = (value: number=60) =>{
    return SetMetadata(ttlName, value);
}