import { getUserById } from '@/data/user/get-user-by-id'
import { Card, CardContent, CardDescription,CardHeader, CardTitle } from '@/components/ui/card'
import AddUserCard from '@/components/user/add-user-card'
import React from 'react'
import { auth } from '@clerk/nextjs/server'

const page = async({params}:{params:Promise<{id:string}>}) => {
    const{id}= await params
    const {userId} =await auth()
    const user = await getUserById(id)
if(id===userId)
  return (
   <div className="w-full h-screen items-center justify-center flex flex-col gap-2">
        <Card className="w-full shadow-none border-none max-w-[400px]">
          <CardHeader>
            <CardTitle>You cannot add yourself</CardTitle>
            <CardDescription>i think you opened the wrong url </CardDescription>
          </CardHeader>
          <CardContent>
          
          </CardContent>
 
        </Card>
      
      </div>
  )
if(!user)
    return (
        <div>
          <p className='text-red-600 text-xs font-semibold py-2'>Error finding user</p>
        </div>
    )
if(user.id!==userId)
  return (
   <div className="w-full h-screen items-center justify-center flex flex-col gap-2">
        <Card className="w-full shadow-none border-none max-w-[400px]">
          <CardHeader>
            <CardTitle>User found</CardTitle>
            <CardDescription>click on plus icon to start texting or call user</CardDescription>
          </CardHeader>
          <CardContent>
            {user &&
                <AddUserCard data={user}/>
            }
          </CardContent>
 
        </Card>
      
      </div>
  )

}

export default page