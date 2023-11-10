'use client';
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react';

interface Context {
  showLogo: boolean;
  setShowLogo: Dispatch<SetStateAction<boolean>>;
}

export const LogoContext = createContext<Context>({
  showLogo: true,
  setShowLogo: () => {},
});

export const useLogoContext = () => useContext(LogoContext);

interface Props {
  children: ReactNode;
}

export const LogoContextProvider = ({ children }: Props) => {
  const [showLogo, setShowLogo] = useState(true);

  return (
    <LogoContext.Provider value={{ showLogo, setShowLogo }}>
      {children}
    </LogoContext.Provider>
  );
};
