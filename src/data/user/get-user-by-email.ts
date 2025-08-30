"use server"

import prisma from "@/prisma"

export const getUserByEmail= async(email:string)=>{
    const userinfo= await prisma.user.findUnique({
        where:{
            email
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