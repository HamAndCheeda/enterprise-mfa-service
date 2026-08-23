import express from 'express';
import AuthService from '../services/AuthService';
import { logger } from '../utils/logger';

const router = express.Router();

router.post('/register', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    
    const user = await AuthService.registerUser(email, password);
    
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email
      }
    });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    
    const result = await AuthService.loginUser(email, password);
    
    if (result.requires_mfa) {
      return res.status(200).json({
        message: 'MFA required',
        requires_mfa: true,
        user_id: result.id
      });
    }
    
    const tokens = AuthService.generateTokens(result.id!);
    
    res.json({
      message: 'Login successful',
      tokens
    });
  } catch (error) {
    next(error);
  }
});

router.post('/refresh', (req, res, next) => {
  try {
    const { refresh_token } = req.body;
    
    if (!refresh_token) {
      return res.status(400).json({ error: 'Refresh token required' });
    }
    
    const payload = AuthService.verifyToken(refresh_token);
    const tokens = AuthService.generateTokens(payload.userId);
    
    res.json({ tokens });
  } catch (error) {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});

export default router;
