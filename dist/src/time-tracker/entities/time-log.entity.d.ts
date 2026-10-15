export declare enum TimeLogStatus {
    RUNNING = "RUNNING",
    COMPLETED = "COMPLETED",
    BREAK = "BREAK"
}
export declare class TimeLog {
    id: string;
    userId: string;
    userName: string;
    userEmail: string;
    userRole: string;
    userPicture: string;
    department: string;
    designation: string;
    date: string;
    clockInTime: Date;
    clockOutTime: Date;
    clockInPhoto: string;
    clockOutPhoto: string;
    durationSeconds: number;
    note: string;
    status: string;
    ipAddress: string;
    device: string;
    createdAt: Date;
    updatedAt: Date;
}
