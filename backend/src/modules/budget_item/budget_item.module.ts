import { BudgetItemRepository } from './budget_item.repository.js';
import { BudgetItemService } from './budget_item.service.js';
import { BudgetItemController } from './budget_item.controller.js';
import { budgetService } from '../budget/index.js';

const budgetItemRepository = new BudgetItemRepository();
const budgetItemService = new BudgetItemService(
    budgetItemRepository,
    budgetService,
);
const budgetItemController = new BudgetItemController(budgetItemService);

export { budgetItemRepository, budgetItemService, budgetItemController };
