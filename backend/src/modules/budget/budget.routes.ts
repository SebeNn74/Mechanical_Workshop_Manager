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
import { CreateBudgetItemDTO } from './budget_item/budget_item.types.js';

const budgetRouter = Router();

budgetRouter.post('/', validateDTO(CreateBudgetDTO), budgetController.add);

budgetRouter.post(
    '/items',
    validateDTO(CreateBudgetItemDTO),
    budgetController.addItem,
);

budgetRouter.get(
    '/',
    validateDTO(BudgetFiltersDTO, 'query'),
    budgetController.getAll,
);

budgetRouter.get(
    '/:id/items',
    validateDTO(ParamIdDTO, 'params'),
    budgetController.getBudgetWithItems,
);

budgetRouter.get(
    '/:id/summary',
    validateDTO(ParamIdDTO, 'params'),
    budgetController.getBudgetSummary,
);

budgetRouter.get(
    '/:id',
    validateDTO(ParamIdDTO, 'params'),
    budgetController.getById,
);

budgetRouter.put(
    '/:id',
    validateDTO(ParamIdDTO, 'params'),
    validateDTO(UpdateBudgetDTO),
    budgetController.update,
);

budgetRouter.delete(
    '/items/:id',
    validateDTO(ParamIdDTO, 'params'),
    budgetController.removeItem,
);

budgetRouter.delete(
    '/:id',
    validateDTO(ParamIdDTO, 'params'),
    budgetController.delete,
);

export default budgetRouter;
