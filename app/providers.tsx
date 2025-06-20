'use client';

import store from '@/lib/redux/store';
import { ReactNode, useEffect, useState } from 'react';
import { Provider } from 'react-redux';

export function Providers({ children }: { children: ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return (
    <Provider store={store}>
      <div suppressHydrationWarning>
        {isHydrated ? children : <div>{children}</div>}
      </div>
    </Provider>
  );
}