'use client';
import { useContext, useEffect } from 'react';
import Notification from './Notification';
import { NavBarContext } from '@/lib/NavBarContext';

const Toast = () => {
  const { toast, setToast } = useContext(NavBarContext);

  useEffect(() => {
    const timeout = setTimeout(() => setToast(null), 5000);

    return () => clearTimeout(timeout);
  }, [toast]);

  return (
    <>
      {toast && (
        <Notification
          label={toast.label}
          icon={toast.icon}
          variant={toast.variant}
        />
      )}
    </>
  );
};

export default Toast;
