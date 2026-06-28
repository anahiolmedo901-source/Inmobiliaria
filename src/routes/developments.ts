import { Router } from 'express';
import { getDb } from '../config/database';
import { requireAuth, requireRole } from '../middleware/auth';
import type { DevelopmentRow, DevelopmentResponse } from '../types';

const router = Router();

function toResponse(d: DevelopmentRow): DevelopmentResponse {
  return {
    id: d.id, title: d.title, description: d.description, images: [d.image_url],
    location: d.location, price_range: d.price_range, units_total: d.units_total,
    units_left: d.units_left, status: d.status, completion_date: d.completion_date, category: d.category,
  };
}

router.get('/', async (req, res) => {
  try {
    const db = getDb();
    const rows = await db<DevelopmentRow>('developments').orderBy('title', 'asc');
    res.json({ success: true, data: rows.map(toResponse) });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const db = getDb();
    const rows = await db<DevelopmentRow>('developments').where({ id: req.params.id }).limit(1);
    if (!rows.length) {
      res.status(404).json({ success: false, error: 'Desarrollo no encontrado' });
      return;
    }
    res.json({ success: true, data: toResponse(rows[0]) });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

router.post('/', requireAuth, requireRole('admin', 'agent'), async (req, res) => {
  try {
    const db = getDb();
    const { id, title, description, image_url, location, price_range, units_total, units_left, status, completion_date, category } = req.body;
    if (!title || !location) {
      res.status(400).json({ success: false, error: 'Título y ubicación requeridos' });
      return;
    }
    const devId = id || `d-${Date.now()}`;
    await db('developments').insert({ id: devId, title, description: description ?? '', image_url: image_url ?? '', location, price_range: price_range ?? '', units_total: units_total ?? 0, units_left: units_left ?? 0, status: status ?? 'pre_launch', completion_date, category: category ?? '' });
    const [created] = await db('developments').where({ id: devId }).limit(1);
    res.status(201).json({ success: true, data: toResponse(created) });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

router.put('/:id', requireAuth, requireRole('admin', 'agent'), async (req, res) => {
  try {
    const db = getDb();
    const existing = await db('developments').where({ id: req.params.id }).limit(1);
    if (!existing.length) {
      res.status(404).json({ success: false, error: 'Desarrollo no encontrado' });
      return;
    }
    const allowed = ['title', 'description', 'image_url', 'location', 'price_range', 'units_total', 'units_left', 'status', 'completion_date', 'category'];
    const updates: Record<string, unknown> = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    if (Object.keys(updates).length) await db('developments').where({ id: req.params.id }).update(updates);
    const [updated] = await db('developments').where({ id: req.params.id }).limit(1);
    res.json({ success: true, data: toResponse(updated) });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

router.delete('/:id', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const db = getDb();
    const existing = await db('developments').where({ id: req.params.id }).limit(1);
    if (!existing.length) {
      res.status(404).json({ success: false, error: 'Desarrollo no encontrado' });
      return;
    }
    await db('developments').where({ id: req.params.id }).delete();
    res.json({ success: true, data: { id: req.params.id } });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

export default router;
