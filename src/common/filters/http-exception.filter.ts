import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // 1. Определяем статус ошибки
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // 2. Извлекаем ответ ошибки
    const exceptionResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : { message: (exception as Error).message };

    // 3. Безопасно достаем сообщение (чтобы ESLint не ругался)
    // Используем Record<string, unknown> вместо any
    const message =
      typeof exceptionResponse === 'object' && exceptionResponse !== null
        ? (exceptionResponse as Record<string, unknown>)['message'] ||
          (exceptionResponse as Record<string, unknown>)['error']
        : exceptionResponse;

    // 4. Логируем для отладки в консоль сервера
    console.error(
      `[${new Date().toISOString()}] ${request.method} ${request.url} - Error:`,
      exception,
    );

    // 5. Отправляем красивый JSON на фронтенд
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message || 'Internal server error',
    });
  }
}
