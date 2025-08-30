import ChatsSidebar from '@/components/chat/sidebar/chat-sidebar/chats-sidebar';
import React from 'react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className='w-full flex h-screen'>
        <ChatsSidebar/>
        {children} 
    </main>
  );
};

export default Layout;