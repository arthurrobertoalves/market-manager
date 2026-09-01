"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllExceptionsFilter = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
let AllExceptionsFilter = class AllExceptionsFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const { statusCode, message, error } = this.resolve(exception);
        response.status(statusCode).json({
            statusCode,
            message,
            error,
            timestamp: new Date().toISOString(),
            path: request.url,
        });
    }
    resolve(exception) {
        if (exception instanceof common_1.HttpException) {
            const response = exception.getResponse();
            if (typeof response === 'string') {
                return {
                    statusCode: exception.getStatus(),
                    message: response,
                    error: exception.name,
                };
            }
            const body = response;
            return {
                statusCode: exception.getStatus(),
                message: body.message ?? exception.message,
                error: body.error ?? exception.name,
            };
        }
        if (exception instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            if (exception.code === 'P2002') {
                const target = exception.meta?.target?.join(', ');
                return {
                    statusCode: common_1.HttpStatus.CONFLICT,
                    message: `Já existe um registro com o mesmo valor para: ${target ?? 'campo único'}.`,
                    error: 'Conflict',
                };
            }
            if (exception.code === 'P2025') {
                return {
                    statusCode: common_1.HttpStatus.NOT_FOUND,
                    message: 'Registro não encontrado.',
                    error: 'Not Found',
                };
            }
            if (exception.code === 'P2003') {
                return {
                    statusCode: common_1.HttpStatus.BAD_REQUEST,
                    message: 'Referência inválida para um registro relacionado.',
                    error: 'Bad Request',
                };
            }
        }
        return {
            statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Erro interno do servidor.',
            error: 'Internal Server Error',
        };
    }
};
exports.AllExceptionsFilter = AllExceptionsFilter;
exports.AllExceptionsFilter = AllExceptionsFilter = __decorate([
    (0, common_1.Catch)()
], AllExceptionsFilter);
//# sourceMappingURL=all-exceptions.filter.js.map