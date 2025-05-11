import { ArrowALeftIcon24Regular } from '@skbkontur/icons/icons/ArrowALeftIcon';
import { Header } from '../../components/header/header';
import { PageBackground } from '../../ui/page/page-background';
import { BookAdditionForm } from '../../components/forms/book-addition-form';
import { ActionIcon } from '@mantine/core';

export const BookAdditionPage = () => {
  return (
    <PageBackground>
      <Header variant="left" withPadding>
        <ActionIcon variant="transparent" onClick={() => { window.history.back(); }}>
          <ArrowALeftIcon24Regular />
        </ActionIcon>
      </Header>
      <BookAdditionForm />
    </PageBackground>
  );
};
