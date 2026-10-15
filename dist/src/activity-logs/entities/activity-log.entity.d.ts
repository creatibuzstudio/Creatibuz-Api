export declare enum ActivityAction {
    LOGIN = "LOGIN",
    LOGOUT = "LOGOUT",
    CREATE = "CREATE",
    UPDATE = "UPDATE",
    DELETE = "DELETE",
    DISBURSE_PAYROLL = "DISBURSE_PAYROLL",
    WITHDRAW_SHARE = "WITHDRAW_SHARE",
    APPROVE_EXPENSE = "APPROVE_EXPENSE",
    REJECT_EXPENSE = "REJECT_EXPENSE",
    UPDATE_SETTINGS = "UPDATE_SETTINGS",
    STATUS_CHANGE = "STATUS_CHANGE",
    EXPORT_REPORT = "EXPORT_REPORT",
    DOWNLOAD_STATEMENT = "DOWNLOAD_STATEMENT",
    SYSTEM = "SYSTEM"
}
export declare enum ActivityModule {
    AUTH = "AUTH",
    USERS = "USERS",
    PAYROLL = "PAYROLL",
    FINANCE = "FINANCE",
    ORDERS = "ORDERS",
    BLOGS = "BLOGS",
    CASE_STUDIES = "CASE_STUDIES",
    PACKAGES = "PACKAGES",
    SETTINGS = "SETTINGS",
    SYSTEM = "SYSTEM"
}
export declare enum ActivityStatus {
    SUCCESS = "SUCCESS",
    FAILED = "FAILED",
    WARNING = "WARNING"
}
export declare class ActivityLog {
    id: string;
    userId: string;
    userName: string;
    userEmail: string;
    userRole: string;
    userPicture: string;
    action: string;
    module: string;
    description: string;
    targetId: string;
    details: string;
    ipAddress: string;
    userAgent: string;
    status: string;
    createdAt: Date;
}
