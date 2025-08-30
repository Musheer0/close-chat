"use client"
import { useIsMobile } from '@/hooks/use-is-mobile'
import { MailQuestionMarkIcon} from 'lucide-react'
import React from 'react'

const Page = () => {
  const {isMobile} =useIsMobile()
if(!isMobile)
  return (
    <div className='flex flex-col h-full flex-1 items-center justify-center '>
      <MailQuestionMarkIcon size={64} className='opacity-60'/>
      <p className='opacity-60 text-lg pt-3'>Nothing to see here </p>
      <p className='opacity-60 text-xs '>Stat texting now!! </p>
    </div>
  )
}

export default Page