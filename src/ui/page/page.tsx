import { PropsWithChildren } from "react";
import { PageBackground } from "./page-background.tsx";
import styles from "./page.module.css"

export const Page = ({ children }: PropsWithChildren) => {
  return (
    <PageBackground>
      <div className={styles.content}>
        {children}
      </div>
    </PageBackground>
  );
}
