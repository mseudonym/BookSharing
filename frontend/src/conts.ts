import * as zod from 'zod';

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
  Settings = '/settings',
  ProfileSettings = '/profile-settings',
  SecuritySettings = '/security-settings',
  EmailSettings = '/email-settings',
  PasswordSettings = '/password-settings',
}

export enum FriendsTabs {
  MyFriends = 'Мои друзья',
  Requests = 'Заявки',
}

export const REQUIRED_FIELD_TEXT = 'Обязательное поле';
export const RESEND_CONFIRMATION_EMAIL_SECONDS = 30;

export const ProfileFormSchema = zod.object({
  firstName: zod
    .string()
    .nonempty(REQUIRED_FIELD_TEXT),
  lastName: zod
    .string()
    .nonempty(REQUIRED_FIELD_TEXT),
  username: zod
    .string()
    .nonempty(REQUIRED_FIELD_TEXT)
    .min(5, 'Никнейм не может быть короче 5-ти символов')
    .max(20, 'Никнейм не может быть длиннее 20-ти символов')
    .regex(/^[a-zA-Z0-9_]+$/, 'Никнейм может содержать только латинские буквы, цифры и нижние подчёркивания'),
  contactUrl: zod
    .string()
    .url('Ссылка должна быть валидной'),
  profilePhoto: zod
    .custom<File>()
});
