"use client"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import AddUserCard from '@/components/user/add-user-card'
import { getUserByEmail } from '@/data/user/get-user-by-email'
import { cn } from '@/lib/utils'
import { useUser } from '@clerk/nextjs'
import { useMutation } from '@tanstack/react-query'
import { Loader2Icon, SearchIcon } from 'lucide-react'
import React, { useState } from 'react'

const Page = () => {
  const { isPending, data, mutate ,isError} = useMutation({
    mutationFn: getUserByEmail,
    onSuccess(data) {
      console.log(data)
    }
  });

  const { user } = useUser()
  const [inputValue, setInputValue] = useState("")

  if (user)
    return (
      <div className="w-full h-screen items-center justify-center flex flex-col gap-2">
        <Card className="w-full shadow-none border-none max-w-[400px]">
          <CardHeader>
            <CardTitle>Search User</CardTitle>
            <CardDescription>Enter user email</CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={async (e) => {
                e.preventDefault()
                if (inputValue === user.primaryEmailAddress?.emailAddress) {
                  
                  return
                }
                mutate(inputValue)
              }}
              className="flex items-center gap-2"
            >
              <Input
                disabled={isPending}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter email"
                className={cn(
                    isError && 'border-red-600'
                )}
              />
              <Button disabled={isPending} type="submit">
                {isPending ? (
                  <Loader2Icon className="animate-spin" />
                ) : (
                  <SearchIcon />
                )}
              </Button>
            </form>
            {isError && <p className='text-red-600 text-xs font-semibold py-2'>Error finding user</p>}
          </CardContent>
          <CardFooter>
            {data &&
                <AddUserCard data={data}/>
            }
          </CardFooter>
        </Card>
      
      </div>
    )
}

export default Page
