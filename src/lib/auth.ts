import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { supabaseAdmin, User } from './supabase'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key'
const SALT_ROUNDS = 10

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function generateToken(user: Omit<User, 'created_at'>): string {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

export function verifyToken(token: string): { id: string; email: string; role: string; name: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string; name: string }
  } catch {
    return null
  }
}

export async function getUserFromToken(token: string): Promise<User | null> {
  const decoded = verifyToken(token)
  if (!decoded) return null
  
  const { data } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('id', decoded.id)
    .single()
  
  return data
}
