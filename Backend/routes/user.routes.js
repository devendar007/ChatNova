import { Router } from "express";
import { body } from "express-validator";
import * as userController from "../controllers/user.controller.js";
import * as authMiddleware from "../middleware/auth.middleware.js"
const router=Router();

router.post("/register",body('email').isEmail().withMessage('Email must be a valid email address'),
body('password').isLength({min:2}).withMessage('Password must be 6 digit long'),
userController.createUserController);
router.post("/login",body('email').isEmail().withMessage('Email must be a valid email address'),
body('password').isLength({min:2}).withMessage('Password must be 6 digit long'),
userController.loginUserController
)
router.get("/profile",authMiddleware.authCheck,userController.profileController);
router.get("/logout",authMiddleware.authCheck,userController.logoutController);
router.get('/all', authMiddleware.authCheck, userController.getAllUsersController);
export default router;