import "server-only"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"

export type Role = "promotor" | "coordenador" | "gerente"

export type SessionUser = {
  id: string
  name: string
  email: string
  role: Role
}

export async function getSession() {
  const session = await auth.api.getSession({ headers: await headers() })
  return session
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await getSession()
  if (!session?.user) return null
  const u = session.user as typeof session.user & { role?: string }
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: (u.role as Role) ?? "promotor",
  }
}

export async function requireUser(): Promise<SessionUser> {
  const user = await getSessionUser()
  if (!user) redirect("/entrar")
  return user
}

export async function requireUserId(): Promise<string> {
  const user = await requireUser()
  return user.id
}

/** Coordenadores e gerentes têm acesso ao painel de gestão. */
export function isGestor(role: Role) {
  return role === "coordenador" || role === "gerente"
}
