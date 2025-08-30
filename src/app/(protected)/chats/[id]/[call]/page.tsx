import React from 'react';

const Page = async ({ params }: { params: Promise<{ id: string ,call:string}> }) => {
  const { id,call } = await params;

  return (
    <div>
      {id}
      {call}
    </div>
  );
};

export default Page;