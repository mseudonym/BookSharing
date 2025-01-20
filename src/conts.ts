export enum AppRoute {
  Root = '/',
  Friends = '/friends',
  Shelf = '/shelf',
  Storage = '/storage',
  Profile = '/profile',
  Book = '/book/:id',
  Users = '/users/:id',
  AddBook = '/add-book',

  Login = '/login',
  Register = '/register',
  ProfileFilling = '/profile-filling',
  EmailConfirmation = '/email-confirmation',
}

export type PropsWithClass = {
  customClass?: string;
}
