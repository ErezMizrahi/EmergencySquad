import { Router } from 'express'
import { getCurrentUser, signin, signout, signup, updatePushToken } from '../controllers/auth.controller';
import { body, param } from 'express-validator';
import { currentUser } from '../middleware/currentUser.middleware';
import { validateRquest } from '../middleware/validateRequest.middleware';
import { requireAuth } from '../middleware/requireAuth.middleware';

const router = Router();

router.get('/currentuser', currentUser, getCurrentUser);

router.post('/signin',[
    body('email')
        .isEmail()
        .withMessage('Email must be valid'),
    body('password')
        .trim()
        .notEmpty()
        .withMessage('You must apply a password')
], validateRquest, signin);

router.post('/signout', signout);

router.post('/signup', [
    body('email')
        .isEmail()
        .withMessage('Email must be valid'),
    body('password')
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage('Password must be betweeb 4-20 characters')
], validateRquest, signup);

router.put('/update-token/:pushToken',currentUser, requireAuth, [
    param('pushToken')
    .not()
    .isEmpty()
    .withMessage('token is required'),
], validateRquest, updatePushToken);

export { router as authRoute }