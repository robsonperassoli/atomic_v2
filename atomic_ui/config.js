export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'http://api.atomic.localhost:4000/api/graphql'

export const GITHUB_AUTH_URL =
  process.env.NEXT_PUBLIC_GITHUB_AUTH_URL ||
  'http://api.atomic.localhost:4000/auth/github'

export const LOGOUT_URL =
  process.env.NEXT_PUBLIC_LOGOUT_URL ||
  'http://api.atomic.localhost:4000/auth/logout'
