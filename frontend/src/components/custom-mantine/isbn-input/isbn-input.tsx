import { TextInput, TextInputProps } from '@mantine/core';
import React, { forwardRef, useEffect, useRef } from 'react';

type ISBNInputProps = TextInputProps & {
    mask?: string;
    maskChar?: string;
};

export const IsbnInput = forwardRef<HTMLInputElement, ISBNInputProps>(
  ({ mask = '999-9-99-999999-9', maskChar = '_', onChange, value, ...props }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const lastValue = useRef<string>(value as string || '');

    // Обработчик изменения значения
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const target = e.target;
      const value = target.value;
      let cursorPos = target.selectionStart || 0;

      // Применяем маску
      const maskedValue = applyMask(value, mask, maskChar);

      // Корректируем позицию курсора
      if (value.length < lastValue.current.length) {
        // При удалении
        cursorPos = Math.max(0, cursorPos);
      } else {
        // При вводе
        cursorPos += maskedValue.length - value.length;
      }

      // Сохраняем новое значение
      lastValue.current = maskedValue;
      target.value = maskedValue;

      // Восстанавливаем позицию курсора
      requestAnimationFrame(() => {
        target.setSelectionRange(cursorPos, cursorPos);
      });

      // Вызываем внешний обработчик
      if (onChange) {
        e.target.value = maskedValue;
        onChange(e);
      }
    };

    // Функция применения маски
    const applyMask = (value: string, mask: string, maskChar: string) => {
      const valueChars = value.replace(/\D/g, '').split('');
      let result = '';
      let charIndex = 0;

      for (let i = 0; i < mask.length; i++) {
        if (charIndex >= valueChars.length) break;

        if (mask[i] === '9') {
          result += valueChars[charIndex] || maskChar;
          charIndex++;
        } else {
          result += mask[i];
        }
      }

      return result;
    };

    // Синхронизация ref
    useEffect(() => {
      if (typeof ref === 'function') {
        ref(inputRef.current);
      } else if (ref) {
        ref.current = inputRef.current;
      }
    }, [ref]);

    return (
      <TextInput
        {...props}
        ref={inputRef}
        value={value}
        onChange={handleChange}
            />
    );
  }
);

IsbnInput.displayName = 'ISBNInput';