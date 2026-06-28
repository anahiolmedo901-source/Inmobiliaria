import { Router } from 'express';
import { getDb } from '../config/database';
import { requireAuth, requireRole } from '../middleware/auth';
import type { PropertyRow, PropertyImage, PropertyResponse, AgentResponse } from '../types';

const router = Router();

function toResponse(row: PropertyRow, images: PropertyImage[], agent: AgentResponse): PropertyResponse {
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle,
    images: images.sort((a, b) => a.sort_order - b.sort_order).map((i) => i.url),
    location: {
      label: row.location_label,
      address_line: row.location_address_line,
      lat: Number(row.location_lat),
      lng: Number(row.location_lng),
    },
    description: row.description,
    features: {
      bedrooms: row.bedrooms,
      bathrooms: Number(row.bathrooms),
      builtAreaM2: Number(row.built_area_m2),
      landAreaM2: Number(row.land_area_m2),
      floors: row.floors,
      parkingSpaces: row.parking_spaces,
    },
    price: Number(row.price),
    status: row.status,
    type: row.type,
    operation: row.operation,
    agent,
    featured: row.featured,
    created_at: row.created_at,
  };
}

router.get('/', async (req, res) => {
  try {
    const db = getDb();
    const { type, operation, status, featured, search, page = '1', limit = '20' } = req.query as Record<string, string>;

    let query = db<PropertyRow>('properties').orderBy('created_at', 'desc');

    if (type) query = query.where({ type });
    if (operation) query = query.where({ operation });
    if (status) query = query.where({ status });
    if (featured === 'true') query = query.where({ featured: true });
    if (search) {
      query = query.where(function () {
        this.where('title', 'like', `%${search}%`)
          .orWhere('location_label', 'like', `%${search}%`);
      });
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const offset = (pageNum - 1) * limitNum;

    const countRow = await query.clone().clear('order').count('* as count').first();
    const total = Number((countRow as { count?: string | number } | undefined)?.count ?? 0);
    const rows = await query.offset(offset).limit(limitNum);

    const agentIds = [...new Set(rows.map(r => r.agent_id))];
    const agentsMap = new Map<string, AgentResponse>();
    if (agentIds.length) {
      const agents = await db('agents').whereIn('id', agentIds);
      for (const a of agents) {
        agentsMap.set(a.id, {
          id: a.id, name: a.name, title: a.title, avatar_url: a.avatar_url,
          phone_e164: a.phone_e164, email: a.email, whatsapp_e164: a.whatsapp_e164,
          experience: a.experience, specialties: a.specialties, languages: a.languages, region: a.region,
        });
      }
    }

    const propertyIds = rows.map(r => r.id);
    const imagesMap = new Map<string, PropertyImage[]>();
    if (propertyIds.length) {
      const allImages = await db<PropertyImage>('property_images').whereIn('property_id', propertyIds).orderBy('sort_order', 'asc');
      for (const img of allImages) {
        if (!imagesMap.has(img.property_id)) imagesMap.set(img.property_id, []);
        imagesMap.get(img.property_id)!.push(img);
      }
    }

    const results: PropertyResponse[] = rows.map(row =>
      toResponse(row, imagesMap.get(row.id) ?? [], agentsMap.get(row.agent_id) ?? {} as AgentResponse)
    );

    res.json({
      success: true,
      data: results,
      pagination: { page: pageNum, limit: limitNum, total },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const db = getDb();
    const rows = await db<PropertyRow>('properties').where({ id: req.params.id }).limit(1);
    if (!rows.length) {
      res.status(404).json({ success: false, error: 'Propiedad no encontrada' });
      return;
    }
    const row = rows[0];
    const [agent] = await db('agents').where({ id: row.agent_id }).limit(1);
    const images = await db<PropertyImage>('property_images').where({ property_id: row.id }).orderBy('sort_order', 'asc');
    res.json({
      success: true,
      data: toResponse(row, images, agent),
    });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

router.post('/', requireAuth, requireRole('admin', 'agent'), async (req, res) => {
  try {
    const db = getDb();
    const { id, title, subtitle, location_label, location_address_line, location_lat, location_lng,
      description, bedrooms, bathrooms, built_area_m2, land_area_m2, floors, parking_spaces,
      price, status, type, operation, agent_id, featured } = req.body;

    if (!title || !location_label || !price || !type || !operation || !agent_id) {
      res.status(400).json({ success: false, error: 'Faltan campos requeridos' });
      return;
    }

    const propId = id || `p-${Date.now()}`;
    await db('properties').insert({
      id: propId, title, subtitle, location_label, location_address_line,
      location_lat: location_lat ?? 0, location_lng: location_lng ?? 0,
      description: description ?? '', bedrooms: bedrooms ?? 0, bathrooms: bathrooms ?? 0,
      built_area_m2: built_area_m2 ?? 0, land_area_m2: land_area_m2 ?? 0, floors: floors ?? 0,
      parking_spaces: parking_spaces ?? 0, price, status: status ?? 'active',
      type, operation, agent_id, featured: featured ?? false,
      created_at: new Date().toISOString(),
    });

    const [created] = await db('properties').where({ id: propId }).limit(1);
    const [agent] = await db('agents').where({ id: agent_id }).limit(1);
    res.status(201).json({ success: true, data: toResponse(created, [], agent) });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

router.put('/:id', requireAuth, requireRole('admin', 'agent'), async (req, res) => {
  try {
    const db = getDb();
    const existing = await db('properties').where({ id: req.params.id }).limit(1);
    if (!existing.length) {
      res.status(404).json({ success: false, error: 'Propiedad no encontrada' });
      return;
    }

    const allowed = ['title', 'subtitle', 'location_label', 'location_address_line', 'location_lat', 'location_lng',
      'description', 'bedrooms', 'bathrooms', 'built_area_m2', 'land_area_m2', 'floors', 'parking_spaces',
      'price', 'status', 'type', 'operation', 'agent_id', 'featured'];

    const updates: Record<string, unknown> = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    if (Object.keys(updates).length) {
      await db('properties').where({ id: req.params.id }).update(updates);
    }

    const [updated] = await db('properties').where({ id: req.params.id }).limit(1);
    const [agent] = await db('agents').where({ id: updated.agent_id }).limit(1);
    const images = await db<PropertyImage>('property_images').where({ property_id: updated.id }).orderBy('sort_order', 'asc');
    res.json({ success: true, data: toResponse(updated, images, agent) });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

router.delete('/:id', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const db = getDb();
    const existing = await db('properties').where({ id: req.params.id }).limit(1);
    if (!existing.length) {
      res.status(404).json({ success: false, error: 'Propiedad no encontrada' });
      return;
    }
    await db('property_images').where({ property_id: req.params.id }).delete();
    await db('properties').where({ id: req.params.id }).delete();
    res.json({ success: true, data: { id: req.params.id } });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

export default router;
