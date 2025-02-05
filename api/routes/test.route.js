import express from 'express';
import { get } from '../controllers/test.controller.js';

const router = express.Router();

router.get('/get', get)

export default router