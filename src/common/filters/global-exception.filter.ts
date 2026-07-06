import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();
    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const payload = exception instanceof HttpException ? exception.getResponse() : null;

    if (status >= 500) this.logger.error(exception);

    response.status(status).json({
      statusCode: status,
      message: this.resolveMessage(payload, status),
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }

  private resolveMessage(payload: string | object | null, status: number) {
    if (typeof payload === 'string') return payload;
    if (payload && 'message' in payload) return payload.message;
    return status === 500 ? 'Internal server error' : 'Request failed';
  }
}
