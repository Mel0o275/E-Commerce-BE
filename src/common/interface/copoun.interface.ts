import { CopounType, CopounUsage } from "../enum/copoun.enum";

export interface ICopoun {
    _id: string;
    name: string;
    startDate: Date;
    endDate:Date;
    percentage?: number;
    amount?:number;
    copounType:CopounType;
    copounUsage: CopounUsage;

    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy: string;
    isDeleted: boolean;

}