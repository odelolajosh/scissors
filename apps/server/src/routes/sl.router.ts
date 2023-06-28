import express from 'express';
import SLController from '../controllers/SLController';

const router = express.Router();

router.use("/:name", SLController.redirectSL);

export default router;
