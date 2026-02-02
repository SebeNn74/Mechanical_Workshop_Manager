import { BudgetRepository } from './budget.repository.js';
import { BudgetService } from './budget.service.js';
import { BudgetController } from './budget.controller.js';
import { receptionService } from '../reception/index.js';

const budgetRepository = new BudgetRepository();
const budgetService = new BudgetService(budgetRepository, receptionService);
const budgetController = new BudgetController(budgetService);

export { budgetRepository, budgetService, budgetController };
