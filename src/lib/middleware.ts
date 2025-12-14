import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from './auth'

export function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7)
  }
  return null
}

export function requireAuth(request: NextRequest): { user: { id: string; email: string; role: string; name: string } } | NextResponse {
  const token = getTokenFromRequest(request)
  
  if (!token) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    )
  }
  
  const user = verifyToken(token)
  
  if (!user) {
    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 401 }
    )
  }
  
  return { user }
}

export function requireAdmin(request: NextRequest): { user: { id: string; email: string; role: string; name: string } } | NextResponse {
  const result = requireAuth(request)
  
  if (result instanceof NextResponse) {
    return result
  }
  
  if (result.user.role !== 'admin') {
    return NextResponse.json(
      { error: 'Admin access required' },
      { status: 403 }
    )
  }
  
  return result
}
