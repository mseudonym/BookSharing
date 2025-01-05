import { PropsWithChildren } from 'react';

export const Page = ({ children }: PropsWithChildren) => {
  return (
    <div className='page'>
      {children}
    </div>
  );
}