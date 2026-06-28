import type { Knex } from 'knex';

export async function up(db: Knex): Promise<void> {
  await db.schema.createTable('agents', (t) => {
    t.string('id', 20).primary();
    t.string('name', 120).notNullable();
    t.string('title', 120).notNullable();
    t.text('avatar_url').notNullable();
    t.string('phone_e164', 30).notNullable();
    t.string('email', 120).notNullable();
    t.string('whatsapp_e164', 30).notNullable();
    t.string('experience', 60);
    t.string('specialties', 200);
    t.string('languages', 60);
    t.string('region', 120);
  });

  await db.schema.createTable('properties', (t) => {
    t.string('id', 20).primary();
    t.string('title', 200).notNullable();
    t.string('subtitle', 200);
    t.string('location_label', 200).notNullable();
    t.string('location_address_line', 200);
    t.decimal('location_lat', 10, 7).notNullable();
    t.decimal('location_lng', 10, 7).notNullable();
    t.text('description').notNullable();
    t.integer('bedrooms').notNullable().defaultTo(0);
    t.decimal('bathrooms', 4, 1).notNullable().defaultTo(0);
    t.decimal('built_area_m2', 10, 2).notNullable().defaultTo(0);
    t.decimal('land_area_m2', 10, 2).notNullable().defaultTo(0);
    t.integer('floors').notNullable().defaultTo(0);
    t.integer('parking_spaces').notNullable().defaultTo(0);
    t.decimal('price', 14, 2).notNullable();
    t.string('status', 30).notNullable().defaultTo('active');
    t.string('type', 30).notNullable();
    t.string('operation', 10).notNullable();
    t.string('agent_id', 20).notNullable().references('id').inTable('agents').onDelete('RESTRICT');
    t.boolean('featured').notNullable().defaultTo(false);
    t.timestamp('created_at', { useTz: true }).notNullable().defaultTo(db.fn.now());
  });

  await db.schema.createTable('property_images', (t) => {
    t.increments('id').primary();
    t.string('property_id', 20).notNullable().references('id').inTable('properties').onDelete('CASCADE');
    t.text('url').notNullable();
    t.integer('sort_order').notNullable().defaultTo(0);
  });

  await db.schema.createTable('developments', (t) => {
    t.string('id', 20).primary();
    t.string('title', 200).notNullable();
    t.text('description').notNullable();
    t.text('image_url').notNullable();
    t.string('location', 200).notNullable();
    t.string('price_range', 60).notNullable();
    t.integer('units_total').notNullable();
    t.integer('units_left').notNullable();
    t.string('status', 30).notNullable().defaultTo('pre_launch');
    t.string('completion_date', 30);
    t.string('category', 60).notNullable();
  });

  await db.schema.createTable('users', (t) => {
    t.increments('id').primary();
    t.string('email', 120).notNullable().unique();
    t.text('password_hash').notNullable();
    t.string('name', 120).notNullable();
    t.string('role', 20).notNullable().defaultTo('client');
    t.text('avatar_url');
    t.timestamp('created_at', { useTz: true }).notNullable().defaultTo(db.fn.now());
  });

  await db.schema.raw(`
    CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
    CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(type);
    CREATE INDEX IF NOT EXISTS idx_properties_operation ON properties(operation);
    CREATE INDEX IF NOT EXISTS idx_properties_featured ON properties(featured) WHERE featured = TRUE;
    CREATE INDEX IF NOT EXISTS idx_properties_agent_id ON properties(agent_id);
    CREATE INDEX IF NOT EXISTS idx_property_images_prop ON property_images(property_id);
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
  `);
}

export async function down(db: Knex): Promise<void> {
  await db.schema.dropTableIfExists('property_images');
  await db.schema.dropTableIfExists('properties');
  await db.schema.dropTableIfExists('developments');
  await db.schema.dropTableIfExists('users');
  await db.schema.dropTableIfExists('agents');
}
