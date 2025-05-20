import React, { PropsWithChildren } from 'react';

import { BackgroundColor, WrapperAlign } from '~/types';
import { Page } from '~/ui/pages';
import { Wrapper } from '~/ui/wrapper';

type PageWithWrapperProps = {
  backgroundColor?: BackgroundColor;
  alignWrapper?: WrapperAlign;
  showMenu?: boolean;
}

export const PageWithWrapper = ({ children, alignWrapper = 'left', backgroundColor = 'rainbow', showMenu = true }: PropsWithChildren<PageWithWrapperProps>) => {
  return (
    <Page backgroundColor={backgroundColor} showMenu={showMenu}>
      <Wrapper align={alignWrapper}>
        {children}
      </Wrapper>
    </Page>
  );
};
