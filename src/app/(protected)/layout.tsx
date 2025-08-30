import ReactQueryClientProvider from '@/components/providers/global/react-query-provider';
import ShareCard from '@/components/user/share-card';
import React from 'react';
import {Toaster} from 'sonner'
import {ReactQueryDevtoolsPanel} from '@tanstack/react-query-devtools'
import SocketProvider from '@/components/providers/global/socket-provider';
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ReactQueryClientProvider>
         <SocketProvider>
           {children}
         </SocketProvider>
          <ShareCard/>
          <Toaster richColors/>
        <ReactQueryDevtoolsPanel/>
        </ReactQueryClientProvider>
  );
};

export default Layout;