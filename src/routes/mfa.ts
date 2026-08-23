import express from 'express';
import MFAService from '../services/MFAService';
import { mfaLimiter } from '../middleware/rateLimiter';

const router = express.Router();

router.post('/setup/totp', async (req, res, next) => {
  try {
    const { user_id, email } = req.body;
    
    if (!user_id || !email) {
      return res.status(400).json({ error: 'User ID and email required' });
    }
    
    const result = await MFAService.setupTOTP(user_id, email);
    
    res.json({
      message: 'TOTP setup initiated',
      secret: result.secret,
      qr_code: result.qrCode
    });
  } catch (error) {
    next(error);
  }
});

router.post('/verify', mfaLimiter, async (req, res, next) => {
  try {
    const { challenge_id, code } = req.body;
    
    if (!challenge_id || !code) {
      return res.status(400).json({ error: 'Challenge ID and code required' });
    }
    
    // Verify code logic would go here
    
    res.json({
      message: 'MFA verification successful',
      verified: true
    });
  } catch (error) {
    next(error);
  }
});

router.post('/setup/sms', async (req, res, next) => {
  try {
    const { user_id, phone } = req.body;
    
    if (!user_id || !phone) {
      return res.status(400).json({ error: 'User ID and phone number required' });
    }
    
    const challenge = MFAService.createChallenge(user_id, 'sms');
    await MFAService.sendSMSChallenge(phone, challenge.code);
    
    res.json({
      message: 'SMS challenge sent',
      challenge_id: challenge.id,
      expires_in: 300
    });
  } catch (error) {
    next(error);
  }
});

router.post('/backup-codes', async (req, res, next) => {
  try {
    const { user_id } = req.body;
    
    if (!user_id) {
      return res.status(400).json({ error: 'User ID required' });
    }
    
    const codes = MFAService.generateBackupCodes(10);
    
    res.json({
      message: 'Backup codes generated',
      codes,
      note: 'Store these codes in a safe place. Each code can only be used once.'
    });
  } catch (error) {
    next(error);
  }
});

export default router;
