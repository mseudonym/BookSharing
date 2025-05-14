import React, { PropsWithChildren } from 'react';

import { Page } from '~/ui/pages/page';
import { Wrapper } from '~/ui/wrapper';

export const PageWithWrapper = ({ children }: PropsWithChildren) => {
  return (
    <Page>
      <Wrapper>
        {children}
      </Wrapper>
    </Page>
  );
};
