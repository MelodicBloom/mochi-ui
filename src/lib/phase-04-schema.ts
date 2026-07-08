/**
 * Phase 04 — Interactivity & Data Schemas
 * Zod-typed contracts for all interactive states, events, and
 * configurable data models used across the Mochi UI showcase.
 */

import { z } from 'zod';

// ─── Design token colorways ───────────────────────────────────────────────────

export const ColorwaySchema = z.enum([
  'mint',
  'blue',
  'pink',
  'lavender',
  'peach',
  'neutral',
  'sage',
]);
export type Colorway = z.infer<typeof ColorwaySchema>;

// ─── Physics presets ──────────────────────────────────────────────────────────

export const PhysicsPresetSchema = z.enum([
  'clay',
  'jelly',
  'stiff',
  'bouncy',
  'slow',
  'snappy',
]);
export type PhysicsPreset = z.infer<typeof PhysicsPresetSchema>;

export const SpringConfigSchema = z.object({
  stiffness: z.number().min(10).max(1000).default(260),
  damping: z.number().min(1).max(100).default(20),
  mass: z.number().min(0.1).max(10).default(1),
  bounce: z.number().min(0).max(1).default(0.3),
  duration: z.number().min(50).max(2000).describe('ms'),
});
export type SpringConfig = z.infer<typeof SpringConfigSchema>;

// ─── Theme ────────────────────────────────────────────────────────────────────

export const ThemeSchema = z.enum(['light', 'dark']);
export type Theme = z.infer<typeof ThemeSchema>;

export const ClayMoodSchema = z.enum([
  'morning',
  'afternoon',
  'evening',
  'playful',
  'serious',
]);
export type ClayMood = z.infer<typeof ClayMoodSchema>;

export const ThemeConfigSchema = z.object({
  mode: ThemeSchema,
  mood: ClayMoodSchema.optional(),
  base: z.string().regex(/^#|^hsl|^rgb/).describe('CSS color string'),
  accent: z.string().regex(/^#|^hsl|^rgb/),
});
export type ThemeConfig = z.infer<typeof ThemeConfigSchema>;

// ─── Audio ────────────────────────────────────────────────────────────────────

export const AudioEventSchema = z.enum([
  'pop',
  'squish',
  'click_soft',
  'click_firm',
  'success',
  'error',
  'slide',
  'hover',
  'ambient',
]);
export type AudioEvent = z.infer<typeof AudioEventSchema>;

export const AudioConfigSchema = z.object({
  enabled: z.boolean().default(true),
  masterVolume: z.number().min(0).max(1).default(0.3),
  hapticEnabled: z.boolean().default(true),
});
export type AudioConfig = z.infer<typeof AudioConfigSchema>;

// ─── Navigation ───────────────────────────────────────────────────────────────

export const NavItemSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  href: z.string().optional(),
  badge: z.string().optional().describe('Short badge text e.g. "New"'),
});
export type NavItem = z.infer<typeof NavItemSchema>;

export const NavStateSchema = z.object({
  activeId: z.string(),
  drawerOpen: z.boolean().default(false),
  items: z.array(NavItemSchema).min(1),
});
export type NavState = z.infer<typeof NavStateSchema>;

// ─── Dashboard widget ─────────────────────────────────────────────────────────

export const MetricCardSchema = z.object({
  id: z.string(),
  title: z.string(),
  value: z.union([z.string(), z.number()]),
  subtitle: z.string().optional(),
  trend: z.object({
    direction: z.enum(['up', 'down', 'flat']),
    percent: z.number(),
    label: z.string().optional(),
  }).optional(),
  colorway: ColorwaySchema.default('mint'),
});
export type MetricCard = z.infer<typeof MetricCardSchema>;

export const ChartBarDatumSchema = z.object({
  value: z.number().min(0).max(100),
  label: z.string(),
  colorway: ColorwaySchema,
});
export type ChartBarDatum = z.infer<typeof ChartBarDatumSchema>;

export const DashboardDataSchema = z.object({
  metrics: z.array(MetricCardSchema),
  chartData: z.array(ChartBarDatumSchema).max(12),
  lastUpdated: z.string().datetime().optional(),
});
export type DashboardData = z.infer<typeof DashboardDataSchema>;

// ─── Form state ───────────────────────────────────────────────────────────────

export const FormFieldSchema = z.object({
  name: z.string(),
  label: z.string(),
  type: z.enum(['text', 'email', 'password', 'number', 'tel', 'url']).default('text'),
  placeholder: z.string().optional(),
  required: z.boolean().default(false),
  value: z.string().default(''),
  error: z.string().optional(),
});
export type FormField = z.infer<typeof FormFieldSchema>;

export const SettingsFormSchema = z.object({
  email: z.string().email('Must be a valid email'),
  password: z.string().min(8, 'At least 8 characters'),
  notificationsEnabled: z.boolean().default(true),
  darkMode: z.boolean().default(false),
  physicsPreset: PhysicsPresetSchema.default('clay'),
  audioEnabled: z.boolean().default(true),
});
export type SettingsForm = z.infer<typeof SettingsFormSchema>;

// ─── Showcase interaction event log ──────────────────────────────────────────

export const InteractionEventSchema = z.object({
  id: z.string().uuid().optional(),
  type: z.enum([
    'click',
    'hover',
    'drag_start',
    'drag_end',
    'scroll',
    'theme_change',
    'audio_toggle',
    'physics_change',
    'nav_change',
    'modal_open',
    'modal_close',
  ]),
  target: z.string().describe('Component or element identifier'),
  timestamp: z.number().describe('performance.now() value'),
  metadata: z.record(z.unknown()).optional(),
});
export type InteractionEvent = z.infer<typeof InteractionEventSchema>;

// ─── Bento grid item ──────────────────────────────────────────────────────────

export const BentoItemConfigSchema = z.object({
  id: z.string(),
  colSpan: z.number().int().min(1).max(4).default(1),
  rowSpan: z.number().int().min(1).max(3).default(1),
  colorway: ColorwaySchema.default('mint'),
  variant: z.enum(['default', 'stats', 'hero', 'compact']).default('default'),
  content: z.unknown().optional().describe('Any renderable React content'),
});
export type BentoItemConfig = z.infer<typeof BentoItemConfigSchema>;

export const BentoGridConfigSchema = z.object({
  columns: z.number().int().min(1).max(6).default(3),
  gap: z.number().min(0).max(64).default(24),
  items: z.array(BentoItemConfigSchema),
});
export type BentoGridConfig = z.infer<typeof BentoGridConfigSchema>;

// ─── Global showcase state ────────────────────────────────────────────────────

export const ShowcaseStateSchema = z.object({
  theme: ThemeSchema.default('light'),
  mood: ClayMoodSchema.optional(),
  physics: PhysicsPresetSchema.default('clay'),
  audio: AudioConfigSchema,
  nav: NavStateSchema,
  dashboard: DashboardDataSchema.optional(),
  form: SettingsFormSchema.partial().optional(),
  events: z.array(InteractionEventSchema).default([]),
});
export type ShowcaseState = z.infer<typeof ShowcaseStateSchema>;

// ─── Default seeds ────────────────────────────────────────────────────────────

export const DEFAULT_NAV_ITEMS: NavItem[] = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'features', label: 'Features' },
  { id: 'components', label: 'Components' },
  { id: 'teams', label: 'Teams' },
  { id: 'start', label: 'Get Started' },
];

export const DEFAULT_DASHBOARD_DATA: DashboardData = {
  metrics: [
    {
      id: 'mrr',
      title: 'Revenue',
      value: '$48.2K',
      subtitle: 'Monthly recurring revenue',
      trend: { direction: 'up', percent: 12.5 },
      colorway: 'mint',
    },
    {
      id: 'users',
      title: 'Users',
      value: 2847,
      subtitle: 'Active subscribers this month',
      trend: { direction: 'up', percent: 12.5, label: 'from last month' },
      colorway: 'blue',
    },
  ],
  chartData: [
    { value: 45, label: 'Q1', colorway: 'lavender' },
    { value: 70, label: 'Q2', colorway: 'peach' },
    { value: 55, label: 'Q3', colorway: 'mint' },
    { value: 85, label: 'Q4', colorway: 'blue' },
  ],
};
