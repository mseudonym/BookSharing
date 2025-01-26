import styles from './profile-filling-form.module.css';
import { InputField } from '../inputs/input-field/input-field.tsx';
import { Button } from '../buttons/button.tsx';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { useMutation } from '@tanstack/react-query';
import { checkProfileFilling } from '../../actions/user-actions.ts';
import { postUsersEditProfile } from '../../generated-api/users/users.ts';
import { InputAvatar } from '../inputs/input-avatar/input-avatar.tsx';
import { REQUIRED_FIELD_TEXT } from '../../conts.ts';

const FormSchema = zod.object({
  firstName: zod
    .string()
    .nonempty(REQUIRED_FIELD_TEXT),
  lastName: zod
    .string()
    .nonempty(REQUIRED_FIELD_TEXT),
  username: zod
    .string()
    .nonempty(REQUIRED_FIELD_TEXT)
    .min(5, 'Никнейм не может быть короче 5-ти символов')
    .max(20, 'Никнейм не может быть длиннее 20-ти символов')
    .regex(/^[a-zA-Z0-9_]+$/, 'Никнейм может содержать только латинские буквы, цифры и нижние подчёркивания'),
  contactUrl: zod
    .string()
    .url(),
  profilePhoto: zod
    .custom<File>(),
  /*
    TODO: Блять ебаный пиздец я не понимаю почему это не робит

    .refine(
      (file) => {
        console.log("file.type");
        console.log(file.type);
        return file.type === "image/jpeg"
      },
      {message: "Изображение должно иметь расширение .jpg"}
    )
    .refine(
      (file) =>
        file.size <= 2_097_152,
      "Изображение должно весить больше 2-ух мегабайт"
    ) */
});

type IFormInput = zod.infer<typeof FormSchema>;

export const ProfileFillingForm = () => {
  const {
    watch,
    setValue,
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<IFormInput>({
    resolver: zodResolver(FormSchema),
    reValidateMode: 'onChange',
    mode: 'onTouched',
  });

  const { mutateAsync: fillProfile } = useMutation({
    mutationFn: postUsersEditProfile,
    onSuccess: async (userData) => {
      await checkProfileFilling(userData);
    },
  });

  const onSubmit = async (data: IFormInput) => {
    await fillProfile({
      FirstName: data.firstName,
      LastName: data.lastName,
      ContactUrl: data.contactUrl,
      PhotoFile: data.profilePhoto,
      Username: data.username,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.photoButton}>
        <InputAvatar
          photoFile={watch('profilePhoto')}
          onPhotoFileChange={(photoFile: File) => setValue('profilePhoto', photoFile)}
          register={register('profilePhoto')}
          error={errors?.profilePhoto?.message}
        />
      </div>

      <InputField
        label="Имя"
        placeholder="Введите имя"
        register={register('firstName')}
        error={errors?.firstName?.message}
      />

      <InputField
        label="Фамилия"
        placeholder="Введите фамилию"
        register={register('lastName')}
        error={errors?.lastName?.message}
      />

      <InputField
        label="Никнейм"
        placeholder="Введите никнейм"
        register={register('username')}
        error={errors?.username?.message}
      />

      <InputField
        label="Ссылка для связи"
        placeholder="Введите ссылку на ваш профиль"
        register={register('contactUrl')}
        error={errors?.contactUrl?.message}
      />

      <Button
        variant="primary"
        onClick={handleSubmit(onSubmit)}
        disabled={!isValid}
      >
        Создать профиль
      </Button>

    </form>
  );
};
