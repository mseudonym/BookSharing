import {FC} from "react";
import {useQuery} from "@tanstack/react-query";
import {getGetUsersMeQueryKey, getUsersMe} from "../../generated-api/users/users.ts";
import {Page} from "../../ui/page/page.tsx";


export const ProfileFillingPage: FC = () => {

    const {data: userData} = useQuery({
        queryFn: () => getUsersMe(),
        queryKey: getGetUsersMeQueryKey(),
    })

    return (
        <Page>
            {userData?.isProfileFilled}
            {}
        </Page>
    );
}