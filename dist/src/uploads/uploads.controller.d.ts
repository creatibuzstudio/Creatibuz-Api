export declare class UploadsController {
    uploadFile(file: Express.Multer.File): Promise<{
        message: string;
        url: any;
        filename: string;
    }>;
}
