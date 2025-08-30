"use client"
import React,{createContext,useContext, useEffect, useState} from 'react';
import { io, Socket } from "socket.io-client"

type SocketContextType =  Socket

const SocketContext =createContext<SocketContextType|null>(null)
const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [socket ,setSocket]= useState<null|Socket>(null)
    const handleConnect= async()=>{
        if(!socket){
               const s = io("http://localhost:3001", {
                withCredentials: true,
                autoConnect: true,
        
                });
                setSocket(s)
            }
    }
        useEffect(()=>{
            handleConnect()
        },[socket])

  return (
    <SocketContext.Provider value={socket}>
        {children}
    </SocketContext.Provider>
  );
};
export function useSocket() {
  const ctx = useContext(SocketContext)
  if (!ctx) throw new Error("useSocket must be used inside <SocketProvider>")
  return ctx
}

export default SocketProvider;