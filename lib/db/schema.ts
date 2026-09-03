import {
  pgTable,
  text,
  timestamp,
  boolean,
  serial,
  integer,
  doublePrecision,
  date,
  jsonb,
} from "drizzle-orm/pg-core"

// --- Better Auth required tables -------------------------------------------
// Column names are camelCase to match Better Auth's defaults. Do not rename.

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull().default(false),
  image: text("image"),
  // Perfil de acesso: 'promotor' | 'coordenador' | 'gerente'
  role: text("role").notNull().default("promotor"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
})

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

// --- App tables ------------------------------------------------------------

// Pontos de venda (lojas) que os promotores visitam.
export const pdv = pgTable("pdv", {
  id: serial("id").primaryKey(),
  nome: text("nome").notNull(),
  rede: text("rede"),
  endereco: text("endereco"),
  cidade: text("cidade").notNull(),
  bairro: text("bairro"),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
  ativo: boolean("ativo").notNull().default(true),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})

// Roteiro/agenda: PDV planejado para um promotor em uma data.
export const routeStop = pgTable("route_stop", {
  id: serial("id").primaryKey(),
  userId: text("userId").notNull(),
  pdvId: integer("pdvId").notNull(),
  dataPlanejada: date("dataPlanejada").notNull(),
  ordem: integer("ordem").notNull().default(0),
  // 'pendente' | 'visitado' | 'justificado'
  status: text("status").notNull().default("pendente"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})

// Visitas: registro de check-in / check-out.
export const visit = pgTable("visit", {
  id: serial("id").primaryKey(),
  userId: text("userId").notNull(),
  pdvId: integer("pdvId").notNull(),
  routeStopId: integer("routeStopId"),
  checkinAt: timestamp("checkinAt").notNull().defaultNow(),
  checkinLat: doublePrecision("checkinLat"),
  checkinLng: doublePrecision("checkinLng"),
  checkoutAt: timestamp("checkoutAt"),
  checkoutLat: doublePrecision("checkoutLat"),
  checkoutLng: doublePrecision("checkoutLng"),
  observacoes: text("observacoes"),
  fotos: jsonb("fotos").notNull().default([]),
  // 'em_andamento' | 'concluida'
  status: text("status").notNull().default("em_andamento"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})
