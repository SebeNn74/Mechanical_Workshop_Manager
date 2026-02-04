import { BudgetRepository } from './budget.repository.js';
import { BudgetService } from './budget.service.js';
import { BudgetController } from './budget.controller.js';
import { receptionService } from '../reception/index.js';
import { checklistItService } from '../checklist/index.js';
import { BudgetItemService } from './budget_item/budget_item.service.js';
import { BudgetItemRepository } from './budget_item/budget_item.repository.js';

const budgetItemRepo = new BudgetItemRepository();
const budgetRepository = new BudgetRepository();

const budgetItemService = new BudgetItemService(budgetItemRepo);
const budgetService = new BudgetService(
    budgetRepository,
    receptionService,
    budgetItemService,
    checklistItService,
);

budgetItemService.setBudgetService(budgetService);

const budgetController = new BudgetController(budgetService);

export { budgetRepository, budgetService, budgetController };
