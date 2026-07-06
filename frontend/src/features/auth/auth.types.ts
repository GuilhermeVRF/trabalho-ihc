export interface User {
  id: string
  name: string
  email: string
  avatarUrl: string | null
  createdAt: string
  updatedAt: string
}

export interface Credentials {
  email: string
  password: string
}

export interface RegisterData extends Credentials {
  name: string
}

export interface AuthSession {
  accessToken: string
  tokenType: 'Bearer'
  user: User
}
