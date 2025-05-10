import _styles from '../../index.module.css';
import styles from './search-friends-page.module.css';
import { Page } from '../../ui/page/page';
import { Header } from '../../components/header/header';
import { ButtonIcon } from '../../components/button-icon/button-icon';
import { ArrowALeftIcon24Regular } from '@skbkontur/icons/icons/ArrowALeftIcon';
import { InputField } from '../../components/inputs/input-field/input-field';

export const SearchFriendsPage = () => {
  return (
    <Page>
      <Header variant="left" withPadding>
        <ButtonIcon variant="flat" onClick={() => { window.history.back(); }}>
          <ArrowALeftIcon24Regular />
        </ButtonIcon>
        <InputField label="" placeholder="Введите никнейм" />
      </Header>
    </Page>
  );
};
