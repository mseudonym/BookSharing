import _styles from '../../index.module.css';
import { Page } from '../../ui/pages/page/page';
import { Header } from '../../components/header/header';
import { ArrowALeftIcon24Regular } from '@skbkontur/icons/icons/ArrowALeftIcon';
import { ActionIcon, Input } from '@mantine/core';

export const SearchFriendsPage = () => {
  return (
    <Page>
      <Header variant="left" withPadding>
        <ActionIcon variant="transparent" onClick={() => { window.history.back(); }}>
          <ArrowALeftIcon24Regular />
        </ActionIcon>
        <Input placeholder="Введите никнейм" />
      </Header>
    </Page>
  );
};
