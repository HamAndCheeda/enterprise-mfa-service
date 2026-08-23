import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User, AuthToken } from '../types';
import { logger } from '../utils/logger';
import { validatePassword, validateEmail } from '../utils/validation';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '24h';

export class AuthService {
  async registerUser(email: string, password: string): Promise<User> {
    // Validation
    if (!validateEmail(email)) {
      throw new Error('Invalid email format');
    }
    
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      throw new Error(passwordValidation.errors.join(', '));
    }
    
    // Hash password
    const password_hash = await bcrypt.hash(password, 10);
    
    // Create user (would be DB call in real implementation)
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      password_hash,
      mfa_enabled: false,
      mfa_method: null,
      backup_codes: [],
      created_at: new Date(),
      updated_at: new Date()
    };
    
    logger.info(`User registered: ${email}`);
    return user;
  }
  
  async loginUser(email: string, password: string): Promise<Partial<User> & { requires_mfa: boolean }> {
    // Validate credentials (would be DB lookup in real implementation)
    const user: User | null = null; // DB lookup would happen here
    
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      throw new Error('Invalid credentials');
    }
    
    logger.info(`User logged in: ${email}`);
    
    return {
      id: user.id,
      email: user.email,
      requires_mfa: user.mfa_enabled
    };
  }
  
  generateTokens(userId: string): AuthToken {
    const access_token = jwt.sign(
      { userId },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    );
    
    const refresh_token = jwt.sign(
      { userId },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    return {
      access_token,
      refresh_token,
      expires_in: 86400,
      token_type: 'Bearer'
    };
  }
  
  verifyToken(token: string): any {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}

export default new AuthService();
