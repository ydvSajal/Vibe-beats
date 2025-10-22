-- Migration: create kv_store_2e8e40fd table for Vibe Beats
-- Run with: supabase db push OR psql -h <host> -U <user> -d <db> -f 001_create_kv_store.sql

CREATE TABLE IF NOT EXISTS kv_store_2e8e40fd (
  key TEXT NOT NULL PRIMARY KEY,
  value JSONB NOT NULL
);

-- Recommended indexes to improve prefix/scan performance
CREATE INDEX IF NOT EXISTS idx_kv_prefix ON kv_store_2e8e40fd (key) WHERE key LIKE 'user:%';
CREATE INDEX IF NOT EXISTS idx_kv_conversations ON kv_store_2e8e40fd (key) WHERE key LIKE 'conversation:%';
