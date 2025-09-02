import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError, Prisma.PrismaClientInitializationError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError | Prisma.PrismaClientInitializationError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Ha ocurrido un error inesperado en la base de datos.';

    // Log del error en la consola del servidor para depuración
    console.error(exception); 

    if (exception instanceof Prisma.PrismaClientInitializationError) {
      // Error de conexión o inicialización de la base de datos
      status = HttpStatus.SERVICE_UNAVAILABLE; // 503 Service Unavailable es más apropiado
      message = 'El servicio de base de datos no está disponible en este momento. Por favor, inténtelo de nuevo más tarde.';
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      // Errores conocidos de Prisma (violaciones de constraints, etc.)
      // Aquí podrías añadir lógica para códigos de error específicos de Prisma
      // Por ejemplo, el código 'P2002' es para violaciones de constraints 'unique'.
      switch (exception.code) {
        case 'P2002':
          status = HttpStatus.CONFLICT; // 409 Conflict
          message = `Ya existe un registro con los datos proporcionados. Campos únicos: ${exception.meta?.target}`;
          break;
        case 'P2025':
            status = HttpStatus.NOT_FOUND; // 404 Not Found
            message = `El registro que se intentó operar no fue encontrado.`;
            break;
        default:
          // Para otros errores conocidos de la base de datos
          status = HttpStatus.BAD_REQUEST; // 400 Bad Request
          message = 'La solicitud a la base de datos no es válida.';
          break;
      }
    }

    response.status(status).json({
      statusCode: status,
      message: message,
    });
  }
}
