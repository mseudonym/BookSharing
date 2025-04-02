import styles from './navbar.module.css';
import { SegmentedControl } from '@mantine/core';
import { AppRoute } from '../../conts';
import { BooksLibraryIcon24Regular, People3Icon24Regular, FolderIcon24Regular, People1Icon24Regular } from '@skbkontur/icons';
import { useLocation, useNavigate } from 'react-router';

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (value: string) => {
    navigate(value);
  };

  return (
    <SegmentedControl
      size="md"
      withItemsBorders={false}
      radius="xl"
      value={location.pathname}
      onChange={handleChange}
      data={[
        {
          value: `${AppRoute.Shelf}`,
          label: (
            <BooksLibraryIcon24Regular />
          ),
        },
        {
          value: `${AppRoute.Friends}`,
          label: (
            <People3Icon24Regular />
          ),
        },
        {
          value: `${AppRoute.Storage}`,
          label: (
            <FolderIcon24Regular />
          ),
        },
        {
          value: `${AppRoute.Profile}`,
          label: (
            <People1Icon24Regular />
          ),
        },
      ]}
      classNames={{
        root: `${styles.navbarRoot}`,
        label: `${styles.navbarLabel}`,
        indicator: `${styles.navbarIndicator}`,
      }}
    />
  );
};
