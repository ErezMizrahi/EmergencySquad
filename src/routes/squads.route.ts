import { Router } from 'express'
import { body } from 'express-validator';
import { currentUser } from '../middleware/currentUser.middleware';
import { validateRquest } from '../middleware/validateRequest.middleware';
import { requireAuth } from '../middleware/requireAuth.middleware';
import mongoose from 'mongoose';
import { addMembers, createNewSquad, deleteSquad, getMySquad } from '../controllers/squad.controller';

const router = Router();

router.use(currentUser);

router.get('/', getMySquad);

router.post('/create', requireAuth ,[
    body('name')
        .notEmpty()
        .withMessage('name must be valid'),
    body('description')
        .notEmpty()
        .withMessage('description must be valid'),
    body('location')
        .notEmpty()
        .withMessage('location must be valid')
], validateRquest, createNewSquad);

router.post('/add-members', requireAuth, [
    body('members')
        .isArray()
        .not()
        .isEmpty()
        .withMessage('members must be provided'),
    body('squadId')
        .not()
        .isEmpty()
        .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
        .withMessage('squad id must be provided')
], validateRquest, addMembers);

router.post('/delete', requireAuth, [
    body('squadId')
        .not()
        .isEmpty()
        .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
        .withMessage('squad id must be provided')
], validateRquest, deleteSquad);

export { router as squadRoute }