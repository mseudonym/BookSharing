import { useEffect, useRef, useState } from 'react';
import styles from './input-cover.module.css';
import _styles from '../../../index.module.css';
import { clsx } from 'clsx';
import { Message, UseFormRegisterReturn } from 'react-hook-form';

export interface InputCoverProps {
  coverFile: File;
  onCoverFileChange: (photoFile: File) => void;
  register?: UseFormRegisterReturn<string>;
  error?: Message | undefined;
}

export const InputCover = ({ register, error, coverFile, onCoverFileChange }: InputCoverProps) => {
  const avatarCoverRef = useRef<HTMLInputElement>(null);
  const [coverrUrl, setCoverUrl] = useState<string>();

  useEffect(() => {
    if (coverFile === undefined) {
      return;
    }

    const objectUrl = URL.createObjectURL(coverFile);
    setCoverUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [coverFile]);

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (files === null) {
      return;
    }

    onCoverFileChange(files[0]);
  }

  function handleButtonClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    if (!avatarCoverRef || !avatarCoverRef.current) return;

    avatarCoverRef.current.click();
  }

  return (
    <>
      <button
        className={styles.coverButton}
        aria-label="Upload profile picture"
        onClick={handleButtonClick}
      >
        <img
          src={coverrUrl ?? '/сamera-icon.svg'}
          className={clsx(coverrUrl && styles.uploadedPhoto)}
          alt=""
        />
      </button>
      <input
        {...register}
        hidden
        ref={avatarCoverRef}
        type="file"
        onChange={handleFileUpload}
      />
      <p className={_styles.error}>{error}</p>
    </>
  );
};
