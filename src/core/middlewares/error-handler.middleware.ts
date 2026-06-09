import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import {
  ValidationError,
  UniqueConstraintError,
  ForeignKeyConstraintError,
  BaseError as SequelizeBaseError,
} from 'sequelize';

// ─────────────────────────────────────────────────────────────────────────
// Definición de clase propia de error (opcional, para lanzar errores
// personalizados desde el servicio)
// ─────────────────────────────────────────────────────────────────────────
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // ── Logging estructurado del error ──────────────────────────────────
  console.error('❌ [ERROR HANDLER]', {
    name: err.name,
    message: err.message,
    stack: err.stack,
  });

  // ── Determinar código de estado y mensaje según tipo de error ──────────

  // 1. Errores propios de negocio lanzados con `throw new AppError(...)`
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
    return;
  }

  // 2. Errores de validación de Zod (que no hayan sido atrapados en el
  //    controlador). Sería raro, pero lo dejamos como fallback.
  if (err instanceof ZodError) {
    res.status(400).json({
      status: 'error',
      message: 'Datos de entrada inválidos.',
      errors: err.flatten().fieldErrors,
    });
    return;
  }

  // 3. Errores de Sequelize: validación de modelo, unicidad o FK
  if (err instanceof ValidationError) {
    // SequelizeValidationError contiene un array `errors` con detalles por campo
    const messages = err.errors.map((e) => e.message).join('; ');
    res.status(422).json({
      status: 'error',
      message: `Error de validación: ${messages}`,
    });
    return;
  }

  if (err instanceof UniqueConstraintError) {
    res.status(409).json({
      status: 'error',
      message: 'El recurso ya existe (violación de restricción única).',
    });
    return;
  }

  if (err instanceof ForeignKeyConstraintError) {
    res.status(422).json({
      status: 'error',
      message: 'No se puede completar la operación: referencia a un registro inexistente.',
    });
    return;
  }

  // 4. Error genérico de Sequelize (conexión, timeout, etc.)
  if (err instanceof SequelizeBaseError) {
    res.status(500).json({
      status: 'error',
      message: 'Error interno en la base de datos.',
    });
    return;
  }

  // 5. Por defecto: error interno del servidor no controlado
  const statusCode =
    'statusCode' in err && typeof (err as any).statusCode === 'number'
      ? (err as any).statusCode
      : 500;

  res.status(statusCode).json({
    status: 'error',
    message:
      process.env.NODE_ENV === 'production'
        ? 'Error interno del servidor.'
        : err.message,
  });
};