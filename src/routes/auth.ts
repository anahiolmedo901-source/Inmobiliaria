import { Router } from 'express';
import { getDb } from '../config/database';
import { hashPassword, comparePassword, signToken, toAuthPayload } from '../utils/auth';
import { requireAuth } from '../middleware/auth';
import type { UserRow } from '../types';

const router = Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ success: false, error: 'Email y contraseña requeridos' });
      return;
    }

    const db = getDb();
    const users = await db<UserRow>('users').where({ email }).limit(1);

    if (!users.length) {
      res.status(401).json({ success: false, error: 'Credenciales inválidas' });
      return;
    }

    const user = users[0];
    const valid = await comparePassword(password, user.password_hash);
    if (!valid) {
      res.status(401).json({ success: false, error: 'Credenciales inválidas' });
      return;
    }

    const payload = toAuthPayload(user);
    const token = signToken(payload);

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar_url: user.avatar_url,
        },
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      res.status(400).json({ success: false, error: 'Email, contraseña y nombre requeridos' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ success: false, error: 'Formato de email inválido' });
      return;
    }
    if (password.length < 8) {
      res.status(400).json({ success: false, error: 'La contraseña debe tener al menos 8 caracteres' });
      return;
    }
    if (!/[A-Z]/.test(password)) {
      res.status(400).json({ success: false, error: 'La contraseña debe tener al menos una mayúscula' });
      return;
    }
    if (!/[a-z]/.test(password)) {
      res.status(400).json({ success: false, error: 'La contraseña debe tener al menos una minúscula' });
      return;
    }
    if (!/\d/.test(password)) {
      res.status(400).json({ success: false, error: 'La contraseña debe tener al menos un dígito' });
      return;
    }

    const db = getDb();
    const existing = await db<UserRow>('users').where({ email }).limit(1);
    if (existing.length) {
      res.status(409).json({ success: false, error: 'El email ya está registrado' });
      return;
    }

    const password_hash = await hashPassword(password);
    const [newUser] = await db('users').insert({
      email,
      password_hash,
      name,
      role: 'client',
      created_at: new Date().toISOString(),
    }).returning(['id', 'email', 'name', 'role', 'avatar_url', 'created_at']);

    const payload = toAuthPayload(newUser);
    const token = signToken(payload);

    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          avatar_url: newUser.avatar_url,
        },
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

router.get('/me', requireAuth, async (req, res) => {
  try {
    const db = getDb();
    const users = await db<UserRow>('users').where({ id: req.user!.userId }).limit(1);
    if (!users.length) {
      res.status(404).json({ success: false, error: 'Usuario no encontrado' });
      return;
    }
    const u = users[0];
    res.json({
      success: true,
      data: {
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        avatar_url: u.avatar_url,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

export default router;
