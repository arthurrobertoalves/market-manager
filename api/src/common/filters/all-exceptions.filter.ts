import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const { statusCode, message, error } = this.resolve(exception);

    response.status(statusCode).json({
      statusCode,
      message,
      error,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  private resolve(exception: unknown): {
    statusCode: number;
    message: string | string[];
    error: string;
  } {
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      if (typeof response === 'string') {
        return {
          statusCode: exception.getStatus(),
          message: response,
          error: exception.name,
        };
      }
      const body = response as { message?: string | string[]; error?: string };
      return {
        statusCode: exception.getStatus(),
        message: body.message ?? exception.message,
        error: body.error ?? exception.name,
      };
    }

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      if (exception.code === 'P2002') {
        const target = (exception.meta?.target as string[] | undefined)?.join(', ');
        return {
          statusCode: HttpStatus.CONFLICT,
          message: `Já existe um registro com o mesmo valor para: ${target ?? 'campo único'}.`,
          error: 'Conflict',
        };
      }
      if (exception.code === 'P2025') {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Registro não encontrado.',
          error: 'Not Found',
        };
      }
      if (exception.code === 'P2003') {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Referência inválida para um registro relacionado.',
          error: 'Bad Request',
        };
      }
    }

    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Erro interno do servidor.',
      error: 'Internal Server Error',
    };
  }
}
