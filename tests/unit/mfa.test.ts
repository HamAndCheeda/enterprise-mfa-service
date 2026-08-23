import MFAService from '../../src/services/MFAService';

describe('MFAService', () => {
  describe('setupTOTP', () => {
    it('should generate TOTP secret and QR code', async () => {
      const result = await MFAService.setupTOTP('user123', 'test@example.com');
      
      expect(result.secret).toBeDefined();
      expect(result.qrCode).toBeDefined();
      expect(result.qrCode).toContain('data:image/png;base64');
    });
  });
  
  describe('generateBackupCodes', () => {
    it('should generate specified number of backup codes', () => {
      const codes = MFAService.generateBackupCodes(5);
      
      expect(codes).toHaveLength(5);
      codes.forEach(code => {
        expect(code).toMatch(/^[a-f0-9]{8}$/);
      });
    });
  });
  
  describe('createChallenge', () => {
    it('should create MFA challenge', () => {
      const challenge = MFAService.createChallenge('user123', 'totp');
      
      expect(challenge.user_id).toBe('user123');
      expect(challenge.type).toBe('totp');
      expect(challenge.attempts).toBe(0);
      expect(challenge.verified).toBe(false);
    });
  });
});
