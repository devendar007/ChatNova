import { Router } from 'express';
import { body } from 'express-validator';
import * as projectController from '../controllers/project.controller.js';
import * as authMiddleWare from '../middleware/auth.middleware.js';

const router = Router();


router.post('/create',
    authMiddleWare.authCheck,
    body('name').isString().withMessage('Name is required'),
    projectController.createProject
)
router.get('/all',authMiddleWare.authCheck, projectController.getAllProject)

router.put('/add-user',
    authMiddleWare.authCheck,
    body('projectId').isString().withMessage('Project ID is required'),
    body('users').isArray({ min: 1 }).withMessage('Users must be an array of strings').bail()
        .custom((users) => users.every(user => typeof user === 'string')).withMessage('Each user must be a string'),
    projectController.addUserToProject
)
router.get('/get-project/:projectId',
    authMiddleWare.authCheck,
    projectController.getProjectById
)


export default router;