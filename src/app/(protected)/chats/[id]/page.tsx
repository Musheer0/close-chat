import ChatView from '@/components/chat/views/chat-view'
import React from 'react'

const page = async({params}:{params:Promise<{id:string}>}) => {
    const{id}= await params
 return (
  <ChatView id={id}/>
 )

}

export default page