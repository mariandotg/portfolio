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
  isMenuOpen: boolean;
  setIsMenuOpen: Dispatch<SetStateAction<boolean>>;
}

export const NavBarContext = createContext<Context>({
  showLogo: true,
  setShowLogo: () => {},
  isMenuOpen: false,
  setIsMenuOpen: () => {},
});

export const useNavBarContext = () => useContext(NavBarContext);

interface Props {
  children: ReactNode;
}

export const NavBarContextProvider = ({ children }: Props) => {
  const [showLogo, setShowLogo] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <NavBarContext.Provider
      value={{ showLogo, setShowLogo, isMenuOpen, setIsMenuOpen }}
    >
      {children}
    </NavBarContext.Provider>
  );
};
