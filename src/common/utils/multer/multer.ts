import multer from 'multer'
import { randomUUID } from 'node:crypto';
import { tmpdir } from 'node:os';
import { fileFilter } from './multer.validation';
import { storageApproachEnum } from 'src/common/enum/multer.enum';

export const cloudFileUpload = ({
    storageApproach = storageApproachEnum.Memory,
    validation = [],
    maxSize = 5
} : {
    storageApproach?: storageApproachEnum,
    validation?: string[],
    maxSize?: number
}) => {
    // const storage = multer.memoryStorage()

    const storage = storageApproach === storageApproachEnum.Memory ? multer.memoryStorage() : multer.diskStorage({
        destination(req: Express.Request, file: Express.Multer.File, callback: (error: Error | null, destination: string) => void) {
            callback(null, tmpdir());
        },
        filename(req: Express.Request, file: Express.Multer.File, callback: (error: Error | null, filename: string) => void) {
            callback(null, `${randomUUID()}-${file.originalname}`);
        },
    })

    return multer({fileFilter: fileFilter(validation), storage, limits: { fileSize: maxSize * 1024 * 1024, files: 2  }});
}