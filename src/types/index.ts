export interface User {
  id: string;
  email: string;
  phone?: string;
  password_hash: string;
  mfa_enabled: boolean;
  mfa_method: 'totp' | 'sms' | 'email' | 'fido2' | null;
  totp_secret?: string;
  backup_codes: string[];
  created_at: Date;
  updated_at: Date;
  last_login?: Date;
}

export interface MFAChallenge {
  id: string;
  user_id: string;
  type: 'totp' | 'sms' | 'email' | 'fido2';
  code: string;
  code_hash: string;
  attempts: number;
  max_attempts: number;
  expires_at: Date;
  verified: boolean;
  created_at: Date;
}

export interface AuthToken {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: 'Bearer';
}

export interface AuditLog {
  id: string;
  user_id?: string;
  action: string;
  resource: string;
  resource_id?: string;
  status: 'success' | 'failure';
  details: Record<string, any>;
  ip_address: string;
  user_agent: string;
  created_at: Date;
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface MFAVerifyRequest {
  challenge_id: string;
  code: string;
}

export interface SetupMFARequest {
  method: 'totp' | 'sms' | 'email' | 'fido2';
  phone?: string;
}

export interface CustomRequest extends Express.Request {
  user?: User;
  userId?: string;
  ip?: string;
}
