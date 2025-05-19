import React, { PropsWithChildren } from 'react';

import { BackgroundColor, WrapperAlign } from '~/types';
import { Page } from '~/ui/pages';
import { Wrapper } from '~/ui/wrapper';

type PageWithWrapperProps = {
  backgroundColor?: BackgroundColor;
  alignWrapper?: WrapperAlign;
}

export const PageWithWrapper = ({ children, alignWrapper = 'left', backgroundColor = 'rainbow' }: PropsWithChildren<PageWithWrapperProps>) => {
  return (
    <Page backgroundColor={backgroundColor}>
      <Wrapper align={alignWrapper}>
        {children}
      </Wrapper>
    </Page>
  );
};
