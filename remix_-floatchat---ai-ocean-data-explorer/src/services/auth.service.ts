import { ServiceResponse } from '../types/service';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: 'Researcher' | 'Oceanographer' | 'Guest';
  isAuthenticated: boolean;
}

export class AuthService {
  static async getCurrentSession(): Promise<ServiceResponse<UserSession>> {
    return {
      data: {
        id: 'usr-guest-101',
        name: 'Guest Explorer',
        email: 'explorer@floatchat.ai',
        role: 'Researcher',
        isAuthenticated: false, // Phase 1 guest session
      },
      success: true,
      isMockData: true,
      timestamp: new Date().toISOString(),
    };
  }
}
