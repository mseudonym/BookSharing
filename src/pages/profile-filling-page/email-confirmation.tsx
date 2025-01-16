// import {Page} from "../../ui/page/page.tsx";
// import {FC} from "react";
// import {useQuery} from "@tanstack/react-query";
// import {getGetUsersMeQueryKey, getUsersMe} from "../../generated-api/users/users.ts";
// import _styles from '../../index.module.css'
//
//
//
// export const EmailConfirmation: FC = () => {
//
//     const {data: userData} = useQuery({
//         queryFn: () => getUsersMe(),
//         queryKey: getGetUsersMeQueryKey(),
//     })
//
//     return (
//         <Page>
//             <h1 className={_styles.title}>
//                 Ожидаем подтверждение почты
//             </h1>
//             <p className={_styles.description}>
//                 Чтобы это сделать, перейдите по ссылке, отправленной на почту.
//             </p>
//             <div className={styles.imageContainer}>
//                 <Image
//                     src="https://cdn.builder.io/api/v1/image/assets/TEMP/f59b02900422fafef67ed776c7523cf61a4eb18f010947ece7ef1c079012cff9?placeholderIfAbsent=true&apiKey=ab84aefce8424550a816a7ab4725a615"
//                     alt="Email confirmation illustration"
//                     className={styles.mainImage}
//                 />
//             </div>
//             <div className={styles.headerActions}>
//                 <IconButton
//                     icon={{
//                         src: "https://cdn.builder.io/api/v1/image/assets/TEMP/b863cf19faa87780bafcf44b0ef0e7b59ca727361d2713b8cd80d616f17d9f91?placeholderIfAbsent=true&apiKey=ab84aefce8424550a816a7ab4725a615",
//                         alt: "Close",
//                         className: styles.iconImage
//                     }}
//                     ariaLabel="Close email confirmation"
//                     onClick={() => {
//                     }}
//                 />
//             </div>
//         </Page>
//     );
// }