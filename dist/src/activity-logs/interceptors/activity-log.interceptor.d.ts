import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ActivityLogsService } from '../activity-logs.service';
export declare class ActivityLogInterceptor implements NestInterceptor {
    private readonly logsService;
    constructor(logsService: ActivityLogsService);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
    private logRequest;
}
