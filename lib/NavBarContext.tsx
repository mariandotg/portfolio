'use client';
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react';

interface Toast {
  icon: string;
  label: string;
  variant: 'warning' | 'error' | 'success';
}

interface Context {
  showLogo: boolean;
  setShowLogo: Dispatch<SetStateAction<boolean>>;
  isMenuOpen: boolean;
  setIsMenuOpen: Dispatch<SetStateAction<boolean>>;
  toast: Toast | null;
  setToast: Dispatch<SetStateAction<Toast | null>>;
}

export const NavBarContext = createContext<Context>({
  showLogo: true,
  setShowLogo: () => {},
  isMenuOpen: false,
  setIsMenuOpen: () => {},
  toast: {
    icon: 'reload',
    label: 'string',
    variant: 'warning',
  },
  setToast: () => {},
});

export const useNavBarContext = () => useContext(NavBarContext);

interface Props {
  children: ReactNode;
}

export const NavBarContextProvider = ({ children }: Props) => {
  const [showLogo, setShowLogo] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  return (
    <NavBarContext.Provider
      value={{
        showLogo,
        setShowLogo,
        isMenuOpen,
        setIsMenuOpen,
        toast,
        setToast,
      }}
    >
      {children}
    </NavBarContext.Provider>
  );
};
