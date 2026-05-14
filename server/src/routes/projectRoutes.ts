import express from 'express';
import { protect } from '../middleware/authMiddleware';
import { 
  createProject, 
  getProjects, 
  getProjectById, 
  updateProject,
  deleteProject,
  updateProjectMembers
} from '../controllers/projectController';

const router = express.Router();

router.use(protect);

router.route('/')
  .post(createProject)
  .get(getProjects);

router.route('/:id')
  .get(getProjectById)
  .put(updateProject)
  .delete(deleteProject);

router.route('/:id/members')
  .put(updateProjectMembers);

export default router;
