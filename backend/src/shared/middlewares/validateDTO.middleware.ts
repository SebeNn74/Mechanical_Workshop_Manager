import { Request, Response, NextFunction } from 'express';
import { ZodSchema, z } from 'zod';

type ValidationSource = 'body' | 'params' | 'query';

export const validateDTO =
    (schema: ZodSchema, source: ValidationSource = 'body') =>
    (req: Request, res: Response, next: NextFunction) => {
        try {
            let dataToValidate: unknown;

            // 1. Extraer los datos a validar según la fuente especificada
            switch (source) {
                case 'body':
                    dataToValidate = req.body;
                    break;
                case 'params':
                    dataToValidate = req.params;
                    break;
                case 'query':
                    dataToValidate = req.query;
                    break;
                default:
                    return next(
                        new Error(
                            `Fuente de validación no soportada: ${source}`,
                        ),
                    );
            }

            // 2. Ejecutar la validación con el esquema proporcionado
            const safeData = schema.parse(dataToValidate);

            // 3. Adjuntar los datos limpios y tipados a la request
            (req as any)[
                `validated${source.charAt(0).toUpperCase() + source.slice(1)}`
            ] = safeData;

            next();
        } catch (error) {
            next(error);
        }
    };

export const ParamIdDTO = z.object({
    id: z.coerce
        .number('El id debe ser un número')
        .int('El id debe ser un número entero')
        .positive('El id debe ser un número positivo'),
});
