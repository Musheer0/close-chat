"use server"

import prisma from "@/prisma"
import { auth } from "@clerk/nextjs/server"

export const getUserById= async(id:string)=>{
    const {userId} =await auth()
    if(userId===id) return null
    const userinfo= await prisma.user.findUnique({
        where:{
            id
        }
    })
    if(userinfo){
        return{
            username:userinfo.username,
            email:userinfo.email,
            image:userinfo.image,
            id:userinfo.id
        }
    }
    else return null
}