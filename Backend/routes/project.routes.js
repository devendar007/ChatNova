import { Router } from 'express';
import { body } from 'express-validator';
import * as projectController from '../controllers/project.controller.js';
import * as authMiddleWare from '../middleware/auth.middleware.js';

const router = Router();


router.post('/create',                                   //it will create an project
    authMiddleWare.authCheck,
    body('name').isString().withMessage('Name is required'),
    projectController.createProject
)
router.get('/all',authMiddleWare.authCheck, projectController.getAllProject)
 
router.put('/add-user',                            //it is used to add users in project
    authMiddleWare.authCheck,
    body('projectId').isString().withMessage('Project ID is required'),
    body('users').isArray({ min: 1 }).withMessage('Users must be an array of strings').bail()
        .custom((users) => users.every(user => typeof user === 'string')).withMessage('Each user must be a string'),
    projectController.addUserToProject
)
router.get('/get-project/:projectId',          //it is used to get info about specific project
    authMiddleWare.authCheck,
    projectController.getProjectById
)
router.put('/update-file-tree',
    authMiddleWare.authCheck,
    body('projectId').isString().withMessage('Project ID is required'),
    body('fileTree').isObject().withMessage('File tree is required'),
    projectController.updateFileTree
)


export default router;