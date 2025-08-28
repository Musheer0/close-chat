import { NextRequest, NextResponse } from "next/server";
import {verifyWebhook} from '@clerk/nextjs/webhooks'
import prisma from "@/lib/prisma";
export const POST = async(req:NextRequest)=>{
    const wh =await verifyWebhook(req,{signingSecret:process.env.CLER_WH!})
    if(wh){
        if(wh.type=='user.created'){
            const data = wh.data;
            const {username,primary_email_address_id,email_addresses,id,image_url} = data
            try {
               const primary_email_address = email_addresses.find((e)=>e.id===primary_email_address_id)
               if(primary_email_address){
                 await prisma.user.create({
                    data:{
                        id,
                        username:username||primary_email_address.email_address.split('@')[0],
                        email: primary_email_address.email_address
                    }
                })
               }
               else{
             return NextResponse.json({error:'error creating user, no email found'},{status:500})
               }
            } catch (error) {
                return NextResponse.json({error:'error creating user'},{status:500})
            }
        }
         if(wh.type=='user.updated'){
            const data = wh.data;
            const {username,primary_email_address_id,email_addresses,id,image_url} = data
            try {
               const primary_email_address = email_addresses.find((e)=>e.id===primary_email_address_id)
               if(primary_email_address){
                 await prisma.user.update({
                    where:{
                        id
                    },
                    data:{
                        id,
                        username:username||primary_email_address.email_address.split('@')[0],
                        email: primary_email_address.email_address
                    }
                })
               }
               else{
             return NextResponse.json({error:'error updating user, no email found'},{status:500})
               }
            } catch (error) {
                return NextResponse.json({error:'error updating user'},{status:500})
            }
        }
    }   
    else{
        return NextResponse.json({error:'invalid webhook'},{status:500})
    }
}