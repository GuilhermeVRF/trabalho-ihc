export interface Team {
  id: string
  name: string
  city: string
  state: string
  crestUrl: string | null
  primaryColor: string
  secondaryColor: string
  coach: string
  createdAt: string
  updatedAt: string
  _count: { players: number; championships: number }
}

export interface TeamPayload {
  name: string
  city: string
  state: string
  primaryColor: string
  secondaryColor: string
  coach: string
}

export interface TeamList {
  data: Team[]
  meta: { page: number; pageSize: number; total: number; totalPages: number }
}
