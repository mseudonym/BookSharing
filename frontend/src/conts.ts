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
  AddBookManually = '/add-book-manually',
  Login = '/login',
  Register = '/register',
  ProfileFilling = '/profile-filling',
  EmailConfirmationWaiting = '/email-confirmation-waiting',
  EmailConfirmation = '/email-confirmation',
  ResetPassword = '/reset-password',
  SearchFriends = '/search-friends',
  ForgotPassword = '/forgot-password',
  Settings = '/settings',
  ProfileSettings = '/profile-settings',
  SecuritySettings = '/security-settings',
  EmailSettings = '/email-settings',
  PasswordSettings = '/password-settings',
  ScanningCode = '/scanning-code'
}

export enum FriendsTabs {
  MyFriends = 'Мои друзья',
  Requests = 'Заявки',
}

export enum StorageTabs {
  Friends = 'Друзей',
  My = 'Мои',
}

export enum BookAdditionTabs {
  Isbn = 'По ISBN',
  Title = 'По названию'
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

export const PasswordBaseSchema = zod.object({
  password: zod
    .string()
    .min(12, 'Пароль должен быть не меньше 12-ти символов')
    .regex(/[0-9]+/, 'Пароль должен содержать минимум одну цифру')
    .regex(/[a-z]+/, 'Пароль должен содержать минимум одну строчную латинскую букву')
    .regex(/[A-Z]+/, 'Пароль должен содержать минимум одну заглавную латинскую букву')
    .regex(/[^0-9a-zA-Z]+/, 'Пароль должен содержать минимум один не буквенный и не числовой символ')
    .nonempty(REQUIRED_FIELD_TEXT),
  confirmPassword: zod
    .string()
    .nonempty(REQUIRED_FIELD_TEXT),
}).superRefine(({ confirmPassword, password }, ctx) => {
  if (confirmPassword !== password) {
    ctx.addIssue({
      code: 'custom',
      message: 'Пароли не совпадают',
      path: ['confirmPassword'],
    });
  }
});