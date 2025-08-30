import ReactQueryClientProvider from '@/components/providers/global/react-query-provider';
import ShareCard from '@/components/user/share-card';
import React from 'react';
import {Toaster} from 'sonner'
import {ReactQueryDevtoolsPanel} from '@tanstack/react-query-devtools'
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ReactQueryClientProvider>
          {children}
          <ShareCard/>
          <Toaster richColors/>
        <ReactQueryDevtoolsPanel/>
        </ReactQueryClientProvider>
  );
};

export default Layout;