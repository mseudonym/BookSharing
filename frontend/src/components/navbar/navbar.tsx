import { SegmentedControl } from '@mantine/core';
import {
  BooksLibraryIcon24Regular,
  BooksLibraryIcon24Solid,
  People2Icon24Regular,
  People2Icon24Solid,
  FolderIcon24Regular,
  FolderIcon24Solid,
  People1Icon24Regular,
  People1Icon24Solid
} from '@skbkontur/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppRoute } from '../../conts';
import styles from './navbar.module.css';

export const Navbar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const navItems = [
    {
      value: AppRoute.Shelf,
      iconRegular: <BooksLibraryIcon24Regular />,
      iconSolid: <BooksLibraryIcon24Solid />,
    },
    {
      value: AppRoute.Friends,
      iconRegular: <People2Icon24Regular />,
      iconSolid: <People2Icon24Solid />,
    },
    {
      value: AppRoute.Storage,
      iconRegular: <FolderIcon24Regular />,
      iconSolid: <FolderIcon24Solid />,
    },
    {
      value: AppRoute.Profile,
      iconRegular: <People1Icon24Regular />,
      iconSolid: <People1Icon24Solid />,
    },
  ];

  const handleNavigate = (value: string) => {
    navigate(value);
  };

  return (
    <SegmentedControl
      size="md"
      withItemsBorders={false}
      radius="xl"
      value={pathname}
      onChange={handleNavigate}
      data={navItems.map((item) => ({
        value: item.value,
        label: pathname === item.value ? item.iconSolid : item.iconRegular,
      }))}
      classNames={{
        root: styles.navbarRoot,
        label: styles.navbarLabel,
        indicator: styles.navbarIndicator,
      }}
    />
  );
};