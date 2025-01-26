import { ArrowALeftIcon24Regular } from '@skbkontur/icons/icons/ArrowALeftIcon';
import { Header } from '../../components/header/header';
import { PageBackground } from '../../ui/page/page-background';
import { ButtonIcon } from '../../components/button-icon/button-icon';
import { BookAdditionForm } from '../../components/forms/book-addition-form';

export const BookAdditionPage = () => {
  return (
    <PageBackground>
      <Header variant="left" withPadding>
        <ButtonIcon variant="flat" onClick={() => { window.history.back(); }}>
          <ArrowALeftIcon24Regular />
        </ButtonIcon>
      </Header>
      <BookAdditionForm />
    </PageBackground>
  );
};
