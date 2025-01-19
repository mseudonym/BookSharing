import React, {FC, useEffect, useRef, useState} from 'react';
import styles from './input-avatar.module.css'
import _styles from '../../../index.module.css';
import {clsx} from "clsx";
import {Message, UseFormRegisterReturn} from "react-hook-form";

export interface InputAvatarProps {
  photoFile: File;
  onPhotoFileChange: (photoFile: File) => void;
  register?: UseFormRegisterReturn<string>,
  error?: Message | undefined
}

export const InputAvatar: FC<InputAvatarProps> = ({register, error, photoFile, onPhotoFileChange}) => {
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>();

  useEffect(() => {
    if (photoFile === undefined) {
      return;
    }

    const objectUrl = URL.createObjectURL(photoFile)
    setAvatarUrl(objectUrl)

    return () => URL.revokeObjectURL(objectUrl)
  }, [photoFile])


  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (files === null) {
      return;
    }

    onPhotoFileChange(files[0]);
  }

  function handleButtonClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    if (!avatarInputRef || !avatarInputRef.current) return;

    avatarInputRef.current.click();
  }

  return (
    <>
      <button
        className={styles.avatarButton}
        aria-label="Upload profile picture"
        onClick={handleButtonClick}>
        <img
          src={avatarUrl ?? "/../../src/assets/сamera-icon.svg"}
          className={clsx(avatarUrl && styles.uploadedPhoto)}
          alt=""
        />
      </button>
      <input
        {...register}
        hidden
        ref={avatarInputRef}
        type='file'
        onChange={handleFileUpload}
      />
      <p className={_styles.error}>{error}</p>
    </>
  );
}
