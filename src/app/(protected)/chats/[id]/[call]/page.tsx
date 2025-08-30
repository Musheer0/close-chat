import CallView from '@/components/call/views/call-view';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';

const Page = async ({ params }: { params: Promise<{ id: string ,call:string}> }) => {
  const { id,call } = await params;

  return (
    <div className='flex-1 h-full flex flex-col justify-center items-center'>
      <CallView id={id}/>
      {/* <Card className='w-full max-w-[300px] flex shadow-none border-0 flex-col items-center'>
        <CardHeader className='w-full flex flex-col items-center'>
          <div className='w-10 h-10 rounded-full bg-red-500'></div>
          <CardTitle>
            Musheer
          </CardTitle>
          <CardDescription>
            Calling...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant={'destructive'}>Cancle</Button>
        </CardContent>
      </Card> */}
    </div>
  );
};

export default Page;