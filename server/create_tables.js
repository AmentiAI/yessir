// Script to create all database tables in Neon
// Run this with: node create_tables.js

import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const sql = neon(process.env.DATABASE_URL);

async function createTables() {
  try {
    console.log('🚀 Starting database table creation...\n');

    // Create users table
    console.log('Creating users table...');
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        company VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;
    console.log('✅ Users table created');

    // Create businesses table
    console.log('Creating businesses table...');
    await sql`
      CREATE TABLE IF NOT EXISTS businesses (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        business_type_id VARCHAR(50) NOT NULL,
        business_name VARCHAR(255) NOT NULL,
        tagline TEXT,
        description TEXT,
        primary_color VARCHAR(7) DEFAULT '#6366F1',
        logo_url TEXT,
        phone VARCHAR(50),
        email VARCHAR(255),
        address TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;
    console.log('✅ Businesses table created');

    // Create sites table
    console.log('Creating sites table...');
    await sql`
      CREATE TABLE IF NOT EXISTS sites (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
        content JSONB NOT NULL,
        is_published BOOLEAN DEFAULT false,
        published_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;
    console.log('✅ Sites table created');

    // Create analytics table
    console.log('Creating analytics table...');
    await sql`
      CREATE TABLE IF NOT EXISTS analytics (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
        event_type VARCHAR(50) NOT NULL,
        event_data JSONB,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    console.log('✅ Analytics table created');

    // Create indexes
    console.log('Creating indexes...');
    await sql`CREATE INDEX IF NOT EXISTS idx_businesses_user_id ON businesses(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_sites_business_id ON sites(business_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_analytics_business_id ON analytics(business_id)`;
    console.log('✅ Indexes created');

    // Verify tables
    console.log('\n📊 Verifying tables...');
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_name IN ('users', 'businesses', 'sites', 'analytics')
      ORDER BY table_name
    `;
    
    console.log('\n✅ All tables created successfully!');
    console.log('\nCreated tables:');
    tables.forEach(table => {
      console.log(`  - ${table.table_name}`);
    });

    console.log('\n🎉 Database setup complete!');
  } catch (error) {
    console.error('❌ Error creating tables:', error);
    process.exit(1);
  }
}

createTables();