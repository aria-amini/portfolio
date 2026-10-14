import type { APIRoute } from 'astro'

export const GET: APIRoute = ({ redirect }) => redirect('/?dialog=book', 307)
