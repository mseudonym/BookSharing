import axios, { AxiosError } from 'axios';
import { StatusCodes } from 'http-status-codes';

import { AppRoute } from '~/conts';
import { UserData } from '~/generated-api/model';
import { getUsersMe } from '~/generated-api/users/users';
import { router } from '~/main';

export const checkAuth = async (redirectToDefault: boolean) => {
  await getUsersMe()
    .then(async (user) => {
      await checkProfileFilling(user, redirectToDefault);
    })
    .catch(async (error: Error | AxiosError) => {
      if (axios.isAxiosError(error)) {
        switch (error.status) {
        case StatusCodes.UNAUTHORIZED:
          await router.navigate(AppRoute.Root);
        }
      }
    });
};

export const redirectIfAuth = async () => {
  await getUsersMe()
    .then(async (user) => {
      await checkProfileFilling(user, true);
    });
};

export const checkProfileFilling = async (user?: UserData, redirectToDefault: boolean = false) => {
  if (user === undefined) {
    await checkAuth(redirectToDefault);
    return;
  }

  if (!user.isEmailConfirm) {
    await router.navigate(AppRoute.EmailConfirmation);
    return;
  }

  if (!user.isProfileFilled) {
    await router.navigate(AppRoute.ProfileFilling);
    return;
  }

  if (redirectToDefault) {
    await router.navigate(AppRoute.Shelf);
  }
};
