export enum AppRoute {
  Root = '/',
  Friends = '/friends',
  Shelf = '/shelf',
  Storage = '/storage',
  Profile = '/profile',
  Book = '/book/:id',
  User = '/user/:username',
  AddBook = '/add-book',
  Login = '/login',
  Register = '/register',
  ProfileFilling = '/profile-filling',
  EmailConfirmation = '/email-confirmation',
  SearchFriends = '/search-friends',
  ForgotPassword = '/forgot-password',
}

export enum FriendsTabs {
  MyFriends = 'Мои друзья',
  Requests = 'Заявки',
}

export const REQUIRED_FIELD_TEXT = 'Это поле нужно заполнить';
