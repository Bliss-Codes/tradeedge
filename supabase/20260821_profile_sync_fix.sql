-- Migration: add profile jsonb column to profiles table.
-- Run this if you already have the table from an earlier schema version.
-- Safe to re-run (IF NOT EXISTS / DEFAULT protects against re-application).
alter table public.profiles
  add column if not exists profile jsonb not null default '{}'::jsonb;
