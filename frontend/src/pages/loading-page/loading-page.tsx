import { Loader } from '@mantine/core';
import React from 'react';

import { Page } from '~/ui/pages';

export const LoadingPage = () => {
  return (
    <Page backgroundColor="white">
      <Loader />
    </Page>
  );
};