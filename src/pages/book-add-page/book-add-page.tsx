import { ArrowALeftIcon24Regular } from '@skbkontur/icons';
import { Header } from '../../components/header/header';
import { PageBackground } from '../../ui/page/page-background';
import { ButtonIcon } from '../../components/button-icon/button-icon';
import { BookAddForm } from '../../components/forms/book-add-form';

export const BookFillingPage = () => {
  return (
    <PageBackground>
      <Header variant="leftPadding">
        <ButtonIcon variant="flat" onClick={() => { window.history.back(); }}>
          <ArrowALeftIcon24Regular />
        </ButtonIcon>
      </Header>
      <BookAddForm />
    </PageBackground>
  );
};
