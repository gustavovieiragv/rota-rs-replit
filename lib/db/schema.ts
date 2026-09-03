import {
  pgTable,
  text,
  timestamp,
  boolean,
  serial,
  integer,
  doublePrecision,
  date,
} from 'drizzle-orm/pg-core'

// --- Better Auth required tables -------------------------------------------
// Column names are camelCase to match Better Auth's defaults. Do not rename.

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  // Perfil de acesso: 'promotor' | 'coordenador' | 'gerente'
  role: text('role').notNull().default('promotor'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
})

// --- App tables ------------------------------------------------------------

// Pontos de venda (lojas) que os promotores visitam.
export const pdv = pgTable('pdv', {
  id: serial('id').primaryKey(),
  nome: text('nome').notNull(),
  rede: text('rede'),
  cnpj: text('cnpj'),
  endereco: text('endereco').notNull(),
  cidade: text('cidade').notNull(),
  uf: text('uf').notNull().default('RS'),
  latitude: doublePrecision('latitude'),
  longitude: doublePrecision('longitude'),
  ativo: boolean('ativo').notNull().default(true),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

// Roteiro/agenda: PDV planejado para um promotor em uma data.
export const roteiro = pgTable('roteiro', {
  id: serial('id').primaryKey(),
  // Promotor responsável pela visita.
  userId: text('userId').notNull(),
  pdvId: integer('pdvId').notNull(),
  data: date('data').notNull(),
  // 'pendente' | 'visitado' | 'justificado'
  status: text('status').notNull().default('pendente'),
  ordem: integer('ordem').notNull().default(0),
  // Quem criou o roteiro (coordenador/gerente) — para gestão.
  criadoPor: text('criadoPor'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

// Visitas: registro de check-in / check-out.
export const visita = pgTable('visita', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  pdvId: integer('pdvId').notNull(),
  roteiroId: integer('roteiroId'),
  checkinAt: timestamp('checkinAt').notNull().defaultNow(),
  checkinLat: doublePrecision('checkinLat'),
  checkinLng: doublePrecision('checkinLng'),
  checkoutAt: timestamp('checkoutAt'),
  checkoutLat: doublePrecision('checkoutLat'),
  checkoutLng: doublePrecision('checkoutLng'),
  observacoes: text('observacoes'),
  fotoUrl: text('fotoUrl'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})
