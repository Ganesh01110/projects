import express from 'express';
import { registerUser, loginUser, getAllUsers, getUserById } from './user.controller';

const router = express.Router();

// User routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/', getAllUsers);
router.get('/:id', getUserById);

export default router;
