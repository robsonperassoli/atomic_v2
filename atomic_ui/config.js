export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://api.atomic.localhost:4000'

export const GRAPHQL_URL = `${API_URL}/api/graphql`
export const GITHUB_AUTH_URL = `${API_URL}/auth/github`
export const LOGOUT_URL = `${API_URL}/auth/logout`
