import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const responseMessage = exception.getResponse();
      message = typeof responseMessage === 'string' ? responseMessage : (responseMessage as any).message || responseMessage;
    } else if (exception instanceof QueryFailedError) {
      // Manejo de errores específicos de base de datos (Ej. Postgres)
      const err = exception as any;
      if (err.code === '23505') {
        status = HttpStatus.CONFLICT;
        message = 'El registro ingresado ya existe (violación de unicidad).';
      } else {
        this.logger.error(`Database error [${err.code}]: ${err.message}`);
        message = 'Error en base de datos.';
      }
    } else {
      this.logger.error(exception);
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
