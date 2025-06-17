import React, { PropsWithChildren } from 'react';

import { BackgroundColor, WrapperAlign } from '~/types';
import { Page } from '~/ui/pages';
import { Wrapper } from '~/ui/wrapper';

type PageWithWrapperProps = {
  backgroundColor?: BackgroundColor;
  alignWrapper?: WrapperAlign;
  withoutMenu?: boolean;
}

export const PageWithWrapper = ({
  children,
  alignWrapper = 'left',
  backgroundColor = 'rainbow',
  withoutMenu = false
}: PropsWithChildren<PageWithWrapperProps>) => {
  return (
    <Page backgroundColor={backgroundColor} withoutMenu={withoutMenu}>
      <Wrapper align={alignWrapper}>
        {children}
      </Wrapper>
    </Page>
  );
};
