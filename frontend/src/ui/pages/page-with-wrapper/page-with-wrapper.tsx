import React, { PropsWithChildren } from 'react';

import { Page } from '~/ui/pages';
import { Wrapper } from '~/ui/wrapper';

type PageWithWrapperProps = {
  alignWrapper?: 'left' | 'center';
}

export const PageWithWrapper = ({ children, alignWrapper = 'left' }: PropsWithChildren<PageWithWrapperProps>) => {
  return (
    <Page>
      <Wrapper align={alignWrapper}>
        {children}
      </Wrapper>
    </Page>
  );
};
