import { ArrowALeftIcon24Regular } from '@skbkontur/icons/icons/ArrowALeftIcon';
import { ButtonIcon } from '../../components/button-icon/button-icon';
import { Header } from '../../components/header/header';
import { PageWithNavbar } from '../../ui/page/page-with-navbar';
import { InputField } from '../../components/inputs/input-field/input-field';

export const SearchFriendsPage = () => {
  return (
    <PageWithNavbar>
      <Header variant="auto">
        <ButtonIcon variant="flat" onClick={() => { window.history.back(); }}>
          <ArrowALeftIcon24Regular />
        </ButtonIcon>
        <InputField label="" placeholder="Введите никнейм" />
      </Header>
    </PageWithNavbar>
  );
};
