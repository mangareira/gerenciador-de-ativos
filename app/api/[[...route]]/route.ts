import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import  asset from './assets'
import  user from './users'
import  departament from './departament'
import ticket from './tickets'

export const runtime = 'nodejs'

const app = new Hono().basePath('/api')

const router = app
  .route('/asset', asset)
  .route('/user', user)
  .route('/departament', departament)
  .route('/ticket', ticket)

export const GET = handle(router)
export const POST = handle(router)
export const PUT = handle(router)
export const DELETE = handle(router)
export const PATCH = handle(router)

export type AppType = typeof router;
