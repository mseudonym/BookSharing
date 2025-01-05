import type { PropsWithChildren } from "react";
import { PropsWithClass } from '../../conts';

export const Navigation = ({ children, customClass }: PropsWithChildren<PropsWithClass>) => {
  return (
    <div className={customClass}>
      {children}
    </div >
  );
}