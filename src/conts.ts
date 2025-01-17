export enum AppRoute {
  Root = '/',
  Friends = '/friends',
  Shelf = '/shelf',
  Storage = '/storage',
  Profile = '/profile',
  Book = '/book/:id',

  Login = '/login',
  Register = '/register',
  ProfileFilling = '/profile-filling',
}

export type PropsWithClass = {
  customClass?: string;
}
