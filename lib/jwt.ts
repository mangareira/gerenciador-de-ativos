import { SignJWT, jwtVerify } from 'jose'
import type { UserPayload } from '@/types/auth'

const secretKey = new TextEncoder().encode(process.env.SECRET_KEY!)
const alg = 'HS512'

export async function signAccessToken(payload: UserPayload['sub']) {
  return new SignJWT({
    sub: payload as any
  })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(secretKey)
}

export async function signRefreshToken(payload: UserPayload['sub']) {
  return new SignJWT({
    sub: payload as any
  })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secretKey)
}

export async function verifyJwtToken(token: string) {
  const { payload } = await jwtVerify<UserPayload>(token, secretKey, {
    algorithms: [alg],
  })

  return payload
}