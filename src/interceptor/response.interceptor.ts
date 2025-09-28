import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const res = ctx.getResponse();

    return next.handle().pipe(
      map((data) => {
        const status = res?.statusCode ?? 200;
        return {
          data,
          message: 'success',
          status,
        };
      }),
      catchError((err) => {
        // Determine HTTP status
        let status = 500;
        let rawMessage: any = 'error';

        if (err instanceof HttpException) {
          status = err.getStatus();
          const response = err.getResponse();

          if (typeof response === 'string') {
            rawMessage = response;
          } else if (response && typeof response === 'object') {
            // response.message can be a string or an array of strings
            if ((response as any).message) {
              rawMessage = (response as any).message;
            } else if ((response as any).error) {
              rawMessage = (response as any).error;
            }
          }
        } else {
          rawMessage = err?.message ?? rawMessage;
        }

        // Normalize message to a single string
        let message: string;
        if (Array.isArray(rawMessage)) {
          message = rawMessage.join('; ');
        } else if (typeof rawMessage === 'object') {
          // Try to stringify minimal info
          try {
            message = JSON.stringify(rawMessage);
          } catch {
            message = String(rawMessage);
          }
        } else {
          message = String(rawMessage);
        }

        // Only send the short message in the error field (no stack)
        const body = { data: null, message, status, error: message };
        return throwError(() => new HttpException(body, status));
      }),
    );
  }
}

export default ResponseInterceptor;
