import _styles from '../../index.module.css';
import { Page } from '../../ui/page/page';
import { Header } from '../../components/header/header';
import { ArrowALeftIcon24Regular } from '@skbkontur/icons/icons/ArrowALeftIcon';
import { InputField } from '../../components/inputs/input-field/input-field';
import { ActionIcon } from '@mantine/core';

export const SearchFriendsPage = () => {
  return (
    <Page>
      <Header variant="left" withPadding>
        <ActionIcon variant="transparent" onClick={() => { window.history.back(); }}>
          <ArrowALeftIcon24Regular />
        </ActionIcon>
        <InputField label="" placeholder="Введите никнейм" />
      </Header>
    </Page>
  );
};
