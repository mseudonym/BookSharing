import { ArrowALeftIcon24Regular } from '@skbkontur/icons/icons/ArrowALeftIcon';
import { Header } from '../../components/header/header';
import { PageWithBackground } from '../../ui/pages/page-with-background/page-with-background';
import { BookAdditionForm } from '../../components/forms/book-addition-form/book-addition-form';
import { ActionIcon } from '@mantine/core';

export const BookAdditionPage = () => {
  return (
    <PageWithBackground>
      <Header variant="left" withPadding>
        <ActionIcon variant="transparent" onClick={() => { window.history.back(); }}>
          <ArrowALeftIcon24Regular />
        </ActionIcon>
      </Header>
      <BookAdditionForm />
    </PageWithBackground>
  );
};
