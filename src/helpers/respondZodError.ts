import type { ZodError } from 'zod';
import type { Response } from 'express';

export function respondZodError(res: Response, error: ZodError): void {
    res.status(400).json({
        status: 'error',
        message: 'Datos de entrada inválidos.',
        errors: error.flatten().fieldErrors,
    });
}