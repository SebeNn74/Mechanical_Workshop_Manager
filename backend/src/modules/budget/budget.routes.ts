import { Router } from 'express';
import { budgetController } from './budget.module.js';
import {
    validateDTO,
    ParamIdDTO,
} from '#/shared/middlewares/validateDTO.middleware.js';
import {
    CreateBudgetDTO,
    UpdateBudgetDTO,
    BudgetFiltersDTO,
} from './budget.types.js';

const BudgetRouter = Router();

BudgetRouter.post('/', validateDTO(CreateBudgetDTO), budgetController.add);

BudgetRouter.get(
    '/',
    validateDTO(BudgetFiltersDTO, 'query'),
    budgetController.getAll,
);

BudgetRouter.get(
    '/:id',
    validateDTO(ParamIdDTO, 'params'),
    budgetController.getById,
);

BudgetRouter.put(
    '/:id',
    validateDTO(ParamIdDTO, 'params'),
    validateDTO(UpdateBudgetDTO),
    budgetController.update,
);

BudgetRouter.delete(
    '/:id',
    validateDTO(ParamIdDTO, 'params'),
    budgetController.delete,
);

export default BudgetRouter;
