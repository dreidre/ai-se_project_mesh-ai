import { Router } from 'express';
import { register, login } from '../controllers/auth.js';
import { loginLimiter, registerLimiter } from '../middleware/rate-limit.js';


const authRouter = Router();

authRouter.post('/register', registerLimiter, register);
authRouter.post('/login', loginLimiter, login);

export { authRouter };
