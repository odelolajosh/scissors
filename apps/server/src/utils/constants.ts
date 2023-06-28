export const appRoutes = ['/', '/login', '/verify', '/register', '/app']

export const reservedNames = [
  ...(appRoutes.map(route => route.replace('/', ''))),
  'api',
  'me'
]