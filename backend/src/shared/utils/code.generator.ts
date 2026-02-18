import prisma from '#/config/prisma.js';

interface CodeGeneratorConfig {
    prefix: string;
    tableName: 'reception' | 'budget' | 'repair';
    fieldName: 'receptionNumber' | 'budgetNumber' | 'repairNumber';
    maxDigits?: number;
}

/**
 * Genera códigos mensuales únicos con formato: PREFIX-YYYYMM-###
 * Ejemplo: REC-202602-001, BUD-202602-001, REP-202602-001
 *
 * @param config Configuración del generador
 * @returns Código generado
 */
export async function generateMonthlyCode(
    config: CodeGeneratorConfig,
): Promise<string> {
    const { prefix, tableName, fieldName, maxDigits = 2 } = config;

    // Obtener año y mes actual
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const yyyyMM = `${year}${month}`;

    // Construir rango de códigos del mes actual
    const monthStart = `${prefix}-${yyyyMM}-${'0'.repeat(maxDigits)}`;
    const monthEnd = `${prefix}-${yyyyMM}-${'9'.repeat(maxDigits)}`;

    // Contar registros existentes en el mes
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const count = await (prisma as any)[tableName].count({
        where: {
            [fieldName]: {
                gte: monthStart,
                lte: monthEnd,
            },
        },
    });

    // Generar nuevo número secuencial
    const nextSequence = count + 1;
    const sequenceStr = String(nextSequence).padStart(maxDigits, '0');

    // Retornar código formado
    return `${prefix}-${yyyyMM}-${sequenceStr}`;
}
