import { Router } from 'express';
import { loginHandler } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.js';
import { loginSchema } from '../validators/auth.validator.js';


const authRoutes = Router();
authRoutes.post('/login', validate(loginSchema), loginHandler);
export default authRoutes;