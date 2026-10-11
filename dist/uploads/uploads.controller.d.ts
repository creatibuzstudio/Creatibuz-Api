export declare class UploadsController {
    uploadFile(file: Express.Multer.File): {
        message: string;
        url: string;
        filename: string;
    };
}
