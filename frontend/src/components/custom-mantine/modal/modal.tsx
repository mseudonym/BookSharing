import { Button, Modal as MantineModal, SimpleGrid, Text } from '@mantine/core';
import React from 'react';

import _styles from '~/index.module.css';

interface ModalProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title: string;
  description?: string;
  submitButtonText: string;
  closeButtonText: string;
}

export const Modal = ({ opened, onClose, onSubmit, title, description, submitButtonText, closeButtonText }: ModalProps) => {
  return (
    <MantineModal opened={opened} onClose={onClose} title={title} centered>
      {description 
        && <Text className={_styles.textGray}>{description}</Text>}
      <SimpleGrid
        cols={{ base: 1, sm: 2 }}
        spacing={{ base: 'md' }}
        verticalSpacing={{ base: 'md' }}
        style={{ width: '100%', overflow: 'hidden' }}
      >
        <Button variant='filled' onClick={onSubmit}>
          {submitButtonText}
        </Button>
        <Button color='outline' onClick={onClose}>
          {closeButtonText}
        </Button>
      </SimpleGrid>
    </MantineModal>
  );
};