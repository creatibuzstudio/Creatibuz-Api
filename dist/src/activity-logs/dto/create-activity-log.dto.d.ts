export declare class CreateActivityLogDto {
    userId?: string;
    userName?: string;
    userEmail?: string;
    userRole?: string;
    userPicture?: string;
    action: string;
    module: string;
    description: string;
    targetId?: string;
    details?: string;
    ipAddress?: string;
    userAgent?: string;
    status?: string;
}
