import { Router } from 'express';
import { getDb } from '../config/database';
import { requireAuth, requireRole } from '../middleware/auth';
import type { AgentRow, AgentResponse } from '../types';

const router = Router();

function toResponse(a: AgentRow): AgentResponse {
  return {
    id: a.id,
    name: a.name, title: a.title, avatar_url: a.avatar_url,
    phone_e164: a.phone_e164, email: a.email, whatsapp_e164: a.whatsapp_e164,
    experience: a.experience, specialties: a.specialties, languages: a.languages, region: a.region,
  };
}

router.get('/', async (req, res) => {
  try {
    const db = getDb();
    const { search } = req.query as Record<string, string>;
    let query = db<AgentRow>('agents').orderBy('name', 'asc');
    if (search) {
      query = query.where(function () {
        this.where('name', 'like', `%${search}%`)
          .orWhere('region', 'like', `%${search}%`)
          .orWhere('specialties', 'like', `%${search}%`);
      });
    }
    const rows = await query;
    res.json({ success: true, data: rows.map(toResponse) });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const db = getDb();
    const rows = await db<AgentRow>('agents').where({ id: req.params.id }).limit(1);
    if (!rows.length) {
      res.status(404).json({ success: false, error: 'Agente no encontrado' });
      return;
    }
    res.json({ success: true, data: toResponse(rows[0]) });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

router.post('/', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const db = getDb();
    const { id, name, title, avatar_url, phone_e164, email, whatsapp_e164, experience, specialties, languages, region } = req.body;
    if (!name || !email) {
      res.status(400).json({ success: false, error: 'Nombre y email requeridos' });
      return;
    }
    const agentId = id || `a-${Date.now()}`;
    await db('agents').insert({ id: agentId, name, title: title ?? '', avatar_url: avatar_url ?? '', phone_e164: phone_e164 ?? '', email, whatsapp_e164: whatsapp_e164 ?? '', experience, specialties, languages, region });
    const [created] = await db('agents').where({ id: agentId }).limit(1);
    res.status(201).json({ success: true, data: toResponse(created) });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

router.put('/:id', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const db = getDb();
    const existing = await db('agents').where({ id: req.params.id }).limit(1);
    if (!existing.length) {
      res.status(404).json({ success: false, error: 'Agente no encontrado' });
      return;
    }
    const allowed = ['name', 'title', 'avatar_url', 'phone_e164', 'email', 'whatsapp_e164', 'experience', 'specialties', 'languages', 'region'];
    const updates: Record<string, unknown> = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    if (Object.keys(updates).length) await db('agents').where({ id: req.params.id }).update(updates);
    const [updated] = await db('agents').where({ id: req.params.id }).limit(1);
    res.json({ success: true, data: toResponse(updated) });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

router.delete('/:id', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const db = getDb();
    const existing = await db('agents').where({ id: req.params.id }).limit(1);
    if (!existing.length) {
      res.status(404).json({ success: false, error: 'Agente no encontrado' });
      return;
    }
    await db('agents').where({ id: req.params.id }).delete();
    res.json({ success: true, data: { id: req.params.id } });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

export default router;
