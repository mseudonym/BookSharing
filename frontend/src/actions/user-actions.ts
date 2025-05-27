import axios from 'axios';
import { StatusCodes } from 'http-status-codes';

import { AppRoute } from '~/conts';
import { UserData } from '~/generated-api/model';
import { getUsersMe } from '~/generated-api/users/users';
import { router } from '~/main';

export const checkAuth = async (redirectToDefault: boolean): Promise<boolean> => {
  try {
    const user = await getUsersMe();
    await checkProfileFilling(user, redirectToDefault);
    return true;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.status === StatusCodes.UNAUTHORIZED && redirectToDefault) {
      await router.navigate(AppRoute.Root);
    }
    return false;
  }
};

export const checkProfileFilling = async (user?: UserData, redirectToDefault: boolean = false): Promise<void> => {
  if (!user) {
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
