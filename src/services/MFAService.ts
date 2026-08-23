import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { MFAChallenge } from '../types';
import { generateSecureCode } from '../utils/encryption';
import { validateTOTPCode } from '../utils/validation';
import { logger } from '../utils/logger';

export class MFAService {
  async setupTOTP(userId: string, email: string): Promise<{ secret: string; qrCode: string }> {
    const secret = speakeasy.generateSecret({
      name: `Enterprise MFA (${email})`,
      issuer: 'Enterprise MFA Service',
      length: 32
    });
    
    const qrCode = await QRCode.toDataURL(secret.otpauth_url!);
    
    logger.info(`TOTP setup initiated for user: ${userId}`);
    
    return {
      secret: secret.base32,
      qrCode
    };
  }
  
  verifyTOTP(secret: string, token: string): boolean {
    if (!validateTOTPCode(token)) {
      return false;
    }
    
    const verified = speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: parseInt(process.env.TOTP_WINDOW || '2')
    });
    
    return verified;
  }
  
  generateBackupCodes(count: number = 10): string[] {
    const codes: string[] = [];
    for (let i = 0; i < count; i++) {
      codes.push(generateSecureCode(8));
    }
    return codes;
  }
  
  validateBackupCode(codes: string[], code: string): boolean {
    return codes.includes(code);
  }
  
  async sendSMSChallenge(phoneNumber: string, code: string): Promise<void> {
    // Integration with SMS provider (e.g., Twilio)
    logger.info(`SMS challenge sent to: ${phoneNumber}`);
  }
  
  async sendEmailChallenge(email: string, code: string): Promise<void> {
    // Integration with email service
    logger.info(`Email challenge sent to: ${email}`);
  }
  
  createChallenge(userId: string, type: 'totp' | 'sms' | 'email' | 'fido2'): MFAChallenge {
    const code = generateSecureCode(6);
    
    return {
      id: Math.random().toString(36).substr(2, 9),
      user_id: userId,
      type,
      code,
      code_hash: Buffer.from(code).toString('base64'),
      attempts: 0,
      max_attempts: 5,
      expires_at: new Date(Date.now() + 5 * 60 * 1000),
      verified: false,
      created_at: new Date()
    };
  }
}

export default new MFAService();
