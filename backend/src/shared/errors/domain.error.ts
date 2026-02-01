export class DomainError extends Error {
    status: number;
    code: string;

    constructor(
        message: string,
        status: number = 400,
        code: string = 'DOMAIN_ERROR',
    ) {
        super(message);
        this.name = this.constructor.name;
        this.status = status;
        this.code = code;
    }
}

export class NotFoundError extends DomainError {
    constructor(message: string) {
        super(message, 404, 'NOT_FOUND_ERROR');
    }
}

export class ConflictError extends DomainError {
    constructor(message: string) {
        super(message, 409, 'CONFLICT_ERROR');
    }
}

export class BusinessValidationError extends DomainError {
    constructor(message: string) {
        super(message, 422, 'BUSINESS_VALIDATION_ERROR');
    }
}
