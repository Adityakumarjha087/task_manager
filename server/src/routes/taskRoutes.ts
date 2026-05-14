import express from 'express';
import { protect } from '../middleware/authMiddleware';
import { 
  createTask, 
  getProjectTasks, 
  updateTask, 
  deleteTask 
} from '../controllers/taskController';

const router = express.Router();

router.use(protect);

router.post('/', createTask);
router.get('/project/:projectId', getProjectTasks);
router.route('/:id')
  .put(updateTask)
  .delete(deleteTask);

export default router;
