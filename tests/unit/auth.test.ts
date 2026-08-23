import AuthService from '../../src/services/AuthService';

describe('AuthService', () => {
  describe('registerUser', () => {
    it('should register a user with valid email and password', async () => {
      const email = 'test@example.com';
      const password = 'SecurePass123!@';
      
      const user = await AuthService.registerUser(email, password);
      
      expect(user.email).toBe(email);
      expect(user.mfa_enabled).toBe(false);
    });
    
    it('should reject weak passwords', async () => {
      const email = 'test@example.com';
      const password = 'weak';
      
      await expect(AuthService.registerUser(email, password)).rejects.toThrow();
    });
  });
  
  describe('generateTokens', () => {
    it('should generate valid JWT tokens', () => {
      const tokens = AuthService.generateTokens('user123');
      
      expect(tokens.access_token).toBeDefined();
      expect(tokens.refresh_token).toBeDefined();
      expect(tokens.token_type).toBe('Bearer');
    });
  });
  
  describe('verifyToken', () => {
    it('should verify valid tokens', () => {
      const tokens = AuthService.generateTokens('user123');
      const payload = AuthService.verifyToken(tokens.access_token);
      
      expect(payload.userId).toBe('user123');
    });
    
    it('should reject invalid tokens', () => {
      expect(() => AuthService.verifyToken('invalid-token')).toThrow();
    });
  });
});
