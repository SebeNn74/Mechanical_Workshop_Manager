import { Router } from 'express';
import { budgetItemController } from './budget_item.module.js';
import {
    validateDTO,
    ParamIdDTO,
} from '#/shared/middlewares/validateDTO.middleware.js';
import {
    CreateBudgetItemDTO,
    UpdateBudgetItemDTO,
    BudgetItemFiltersDTO,
} from './budget_item.types.js';

const BudgetItemRouter = Router();

BudgetItemRouter.post('/', validateDTO(CreateBudgetItemDTO), budgetItemController.add);

BudgetItemRouter.get(
    '/',
    validateDTO(BudgetItemFiltersDTO, 'query'),
    budgetItemController.getAll,
);

BudgetItemRouter.get(
    '/:id',
    validateDTO(ParamIdDTO, 'params'),
    budgetItemController.getById,
);

BudgetItemRouter.put(
    '/:id',
    validateDTO(ParamIdDTO, 'params'),
    validateDTO(UpdateBudgetItemDTO),
    budgetItemController.update,
);

BudgetItemRouter.delete(
    '/:id',
    validateDTO(ParamIdDTO, 'params'),
    budgetItemController.delete,
);

export default BudgetItemRouter;
