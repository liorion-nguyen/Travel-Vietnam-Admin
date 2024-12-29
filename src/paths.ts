export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password' },
  dashboard: {
    overview: '/dashboard',
    account: '/dashboard/account',
    customers: '/dashboard/customers',
    tours: '/dashboard/tours',
    hotels: '/dashboard/hotels',
    discounts: '/dashboard/discounts',
    rooms: '/dashboard/rooms',
    bookings: '/dashboard/bookings',
    roles: '/dashboard/roles',
    integrations: '/dashboard/integrations',
    settings: '/dashboard/settings',
  },
  errors: { notFound: '/errors/not-found' },
} as const;
