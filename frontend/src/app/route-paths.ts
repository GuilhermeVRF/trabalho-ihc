export const routes = {
  login: '/login', register: '/cadastro', dashboard: '/', championships: '/campeonatos',
  teams: '/times', players: '/jogadores', matches: '/jogos', standings: '/classificacao',
  statistics: '/estatisticas', profile: '/perfil',
} as const

export const championshipRoutes = {
  create: '/campeonatos/novo',
  edit: (id: string) => `/campeonatos/${id}/editar`,
  teams: (id: string) => `/campeonatos/${id}/times`,
}

export const teamRoutes = {
  create: '/times/novo',
  edit: (id: string) => `/times/${id}/editar`,
}

export const playerRoutes = {
  create: '/jogadores/novo',
  edit: (id: string) => `/jogadores/${id}/editar`,
}
