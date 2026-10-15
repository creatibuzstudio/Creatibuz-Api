import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ActivityLogsService } from '../activity-logs.service';
import { ActivityAction, ActivityModule, ActivityStatus } from '../entities/activity-log.entity';

@Injectable()
export class ActivityLogInterceptor implements NestInterceptor {
  constructor(private readonly logsService: ActivityLogsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp();
    const req = http.getRequest();
    const method = req.method;
    const url = req.originalUrl || req.url || '';

    // Only intercept mutating actions or auth login
    const isMutating = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);
    const isLogsPath = url.includes('/activity-logs') || url.includes('/logs');

    if (!isMutating || isLogsPath) {
      return next.handle();
    }

    return next.handle().pipe(
      tap({
        next: (responseBody) => {
          this.logRequest(req, responseBody, ActivityStatus.SUCCESS).catch(() => {});
        },
        error: (err) => {
          this.logRequest(req, { error: err.message }, ActivityStatus.FAILED).catch(() => {});
        },
      }),
    );
  }

  private async logRequest(req: any, responseData: any, status: ActivityStatus) {
    try {
      const url: string = req.originalUrl || req.url || '';
      const method: string = req.method;
      const user = req.user || {};
      const body = req.body || {};

      let module = ActivityModule.SYSTEM;
      let action = ActivityAction.UPDATE;
      let description = `${method} request executed on ${url}`;

      // Module & Action categorization
      if (url.includes('/auth/login')) {
        module = ActivityModule.AUTH;
        action = ActivityAction.LOGIN;
        const email = body.email || user.email || 'User';
        description = `User ${email} authenticated into system dashboard`;
      } else if (url.includes('/payroll/disburse')) {
        module = ActivityModule.PAYROLL;
        action = ActivityAction.DISBURSE_PAYROLL;
        description = `Disbursed monthly employee payroll for period ${body.monthName || body.month || 'Current Month'}`;
      } else if (url.includes('/payroll/withdraw-executive')) {
        module = ActivityModule.FINANCE;
        action = ActivityAction.WITHDRAW_SHARE;
        description = `Processed executive leadership profit share withdrawal voucher ($${body.amount || 0})`;
      } else if (url.includes('/payroll')) {
        module = ActivityModule.PAYROLL;
        action = method === 'POST' ? ActivityAction.CREATE : ActivityAction.UPDATE;
        description = `Payroll records updated or generated for ${body.month || 'active cycle'}`;
      } else if (url.includes('/finance/settings')) {
        module = ActivityModule.FINANCE;
        action = ActivityAction.UPDATE_SETTINGS;
        description = `Updated corporate finance distribution ratios & profit share pool configuration`;
      } else if (url.includes('/finance/expense')) {
        module = ActivityModule.FINANCE;
        action = url.includes('/approve') ? ActivityAction.APPROVE_EXPENSE : ActivityAction.CREATE;
        description = `Expense voucher transaction: ${body.title || 'Operational Expense'} ($${body.amount || 0})`;
      } else if (url.includes('/finance')) {
        module = ActivityModule.FINANCE;
        action = method === 'DELETE' ? ActivityAction.DELETE : ActivityAction.UPDATE;
        description = `Financial record updated: ${url}`;
      } else if (url.includes('/users')) {
        module = ActivityModule.USERS;
        if (method === 'POST') {
          action = ActivityAction.CREATE;
          description = `Created/registered new user profile (${body.name || body.email || 'Member'})`;
        } else if (method === 'DELETE') {
          action = ActivityAction.DELETE;
          description = `Deleted user profile from registry`;
        } else {
          action = ActivityAction.UPDATE;
          description = `Updated user settings/profile for ${body.name || user.email || 'Team Member'}`;
        }
      } else if (url.includes('/orders')) {
        module = ActivityModule.ORDERS;
        if (method === 'POST') {
          action = ActivityAction.CREATE;
          description = `Created new client order / project contract #${body.projectName || body.invoiceNumber || ''}`;
        } else if (method === 'DELETE') {
          action = ActivityAction.DELETE;
          description = `Removed order record from pipeline`;
        } else {
          action = ActivityAction.UPDATE;
          description = `Updated client order status / advance payment for ${body.projectName || 'project'}`;
        }
      } else if (url.includes('/blog')) {
        module = ActivityModule.BLOGS;
        action = method === 'POST' ? ActivityAction.CREATE : (method === 'DELETE' ? ActivityAction.DELETE : ActivityAction.UPDATE);
        description = `${action} blog publication (${body.title || 'Article'})`;
      } else if (url.includes('/casestudies')) {
        module = ActivityModule.CASE_STUDIES;
        action = method === 'POST' ? ActivityAction.CREATE : (method === 'DELETE' ? ActivityAction.DELETE : ActivityAction.UPDATE);
        description = `${action} case study showcase (${body.title || 'Case Study'})`;
      } else if (url.includes('/package')) {
        module = ActivityModule.PACKAGES;
        action = method === 'POST' ? ActivityAction.CREATE : ActivityAction.UPDATE;
        description = `${action} service package tier`;
      }

      const clientIp =
        req.headers?.['x-forwarded-for'] ||
        req.socket?.remoteAddress ||
        '127.0.0.1';
      const userAgent = req.headers?.['user-agent'] || 'Web Browser';

      const userName = user.name || body.requestedByName || user.email?.split('@')[0] || 'System Administrator';

      await this.logsService.create({
        userId: user.id || user.userId || null,
        userName,
        userEmail: user.email || body.email || null,
        userRole: user.role || 'admin',
        action,
        module,
        description,
        ipAddress: String(clientIp).split(',')[0].trim(),
        userAgent: String(userAgent).slice(0, 300),
        status,
        details: body ? JSON.stringify({ path: url, method, bodySummary: Object.keys(body).slice(0, 6) }) : undefined,
      });
    } catch {
      // Non-blocking
    }
  }
}
