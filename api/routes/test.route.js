import express from 'express';
import { get, testsignedin } from '../controllers/test.controller.js';
import { verifyToken } from '../utils/verifyUser.js'

const router = express.Router();

router.get('/get', get)
router.get('/testsignedin', verifyToken, testsignedin)

export default router