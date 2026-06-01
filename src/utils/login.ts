import type { AuthRole } from '../theme/ThemeContext';

type Credentials = {
  email: string;
  password: string;
};

type LoginResult = {
  success: boolean;
  role?: AuthRole;
  error?: string;
};

const MOCK_USERS: Record<string, { password: string; role: AuthRole; name: string }> = {
  'admin@viviana.mx': { password: 'admin123', role: 'admin', name: 'Admin Viviana' },
  'agente@viviana.mx': { password: 'agente123', role: 'agent', name: 'Julian Thorne' },
  'cliente@viviana.mx': { password: 'cliente123', role: 'public', name: 'Cliente VIP' },
};

export function validateCredentials({ email, password }: Credentials): LoginResult {
  if (!email.trim()) {
    return { success: false, error: 'Ingresa tu correo electrónico' };
  }
  if (!password.trim()) {
    return { success: false, error: 'Ingresa tu contraseña' };
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = MOCK_USERS[normalizedEmail];

  if (!user) {
    return { success: false, error: 'Credenciales inválidas. Intenta de nuevo.' };
  }

  if (user.password !== password.trim()) {
    return { success: false, error: 'Credenciales inválidas. Intenta de nuevo.' };
  }

  return { success: true, role: user.role };
}

export function getMockUserInfo(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const user = MOCK_USERS[normalizedEmail];
  if (!user) return null;
  return { name: user.name, role: user.role };
}

export const MOCK_CREDENTIALS_HINT = {
  admin: { email: 'admin@viviana.mx', password: 'admin123' },
  agent: { email: 'agente@viviana.mx', password: 'agente123' },
  client: { email: 'cliente@viviana.mx', password: 'cliente123' },
};
