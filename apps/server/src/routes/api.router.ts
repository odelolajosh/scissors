import express from 'express';
import AuthController from '../controllers/AuthController';
import SLController from '../controllers/SLController';
import UserController from '../controllers/UserController';
import { requireAccess, requireRefresh } from '../middlewares/auth';

const router = express.Router();

router.post('/auth/login', AuthController.login);
router.post('/auth/signup', AuthController.signup);
router.post('/auth/verify', AuthController.verifyMail);
router.delete('/auth/logout', requireAccess, AuthController.logout);
router.post('/auth/refresh', requireRefresh, AuthController.refresh);

router.get('/sl', requireAccess, SLController.getAll);
router.get('/sl/:name', requireAccess, SLController.getOne);
router.post('/sl', requireAccess, SLController.create);
router.put('/sl/:name', requireAccess, SLController.update);
router.delete('/sl/:name', requireAccess, SLController.delete);
router.get('/sl/check/:name', requireAccess, SLController.checkNameAvailability);
// router.get('/sl/qr/:name', requireAccess, SLController.getQR);
// router.get('/sl/qr/:name/:size', requireAccess, SLController.getQR);

router.get('/stats', requireAccess, SLController.getStats);
router.get('/stats/:name', requireAccess, SLController.getOneStat);

router.get('/me', requireAccess, UserController.me);

export default router;
