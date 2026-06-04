import { Inject, Injectable } from "@nestjs/common";
import type { RedisClientType } from "@redis/client";
import { Types } from "mongoose";

@Injectable()
export class RedisService {
    constructor(
        @Inject("Redis_Client")
        private readonly client: RedisClientType,
    ) { }

    revokeTokenKey(userId: string | number, jti: string): string {
        return `revoked_tokens:${this.revokeTokenBaseKey(userId)}:${jti}`;
    }

    revokeTokenBaseKey(userId: string | number): string {
        return `revoked_tokens:${userId}`;
    }

    async set(key: string, value: string, expireTime?: number): Promise<void> {
        try {
            await this.client.set(
                key,
                value,
                expireTime ? { EX: expireTime } : undefined,
            );
        } catch (error) {
            console.error("Error setting value in Redis:", error);
            throw error;
        }
    }

    async get(key: string): Promise<string | null> {
        try {
            return await this.client.get(key);
        } catch (error) {
            console.error("Error getting value from Redis:", error);
            throw error;
        }
    }

    async update(
        key: string,
        value: string,
        expireTime?: number,
    ): Promise<void> {
        try {
            await this.client.set(
                key,
                value,
                expireTime ? { EX: expireTime } : undefined,
            );
        } catch (error) {
            console.error("Error updating value in Redis:", error);
            throw error;
        }
    }

    async deleteKey(key: string | string[]): Promise<number> {
        try {
            if (!key || (Array.isArray(key) && key.length === 0)) return 0;
            return await this.client.del(key);
        } catch (error) {
            console.error("Error deleting key from Redis:", error);
            throw error;
        }
    }

    async ttl(key: string): Promise<number> {
        return this.client.ttl(key);
    }

    async keyByPrefix(prefix: string): Promise<string[]> {
        return this.client.keys(`${prefix}*`);
    }

    async mGet(keys: string[] = []): Promise<(string | null)[]> {
        if (keys.length === 0) return [];
        return this.client.mGet(keys);
    }

    private key(userId: Types.ObjectId | string) {
        return `user:FCM:${userId}`;
    }

    async addFCM(userId: Types.ObjectId | string, FCMToken: string) {
        return this.client.sAdd(this.key(userId), FCMToken);
    }

    async removeFCM(userId: Types.ObjectId | string, FCMToken: string) {
        return this.client.sRem(this.key(userId), FCMToken);
    }

    async getFCMs(userId: Types.ObjectId | string) {
        return this.client.sMembers(this.key(userId));
    }

    async hasFCMs(userId: Types.ObjectId | string) {
        return this.client.sCard(this.key(userId));
    }

    async removeFCMUser(userId: Types.ObjectId | string) {
        return this.client.del(this.key(userId));
    }

    private socketKey(userId: Types.ObjectId | string) {
        return `user:sockets:${userId}`;
    }

    async addSocket(userId: Types.ObjectId | string, socketId: string) {
        return this.client.sAdd(this.socketKey(userId), socketId);
    }

    async removeSocket(userId: Types.ObjectId | string, socketId: string) {
        return this.client.sRem(this.socketKey(userId), socketId);
    }

    async getSockets(userId: Types.ObjectId | string) {
        return this.client.sMembers(this.socketKey(userId));
    }

    async hasSockets(userId: Types.ObjectId | string) {
        return this.client.sCard(this.socketKey(userId));
    }

    async removeUser(userId: Types.ObjectId | string) {
        return this.client.del(this.socketKey(userId));
    }
}