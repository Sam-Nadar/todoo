import client from "@/app/db"
import { NextRequest,NextResponse } from "next/server"
// import cookieParser from "cookie-parser";
import jwt, { JwtPayload } from "jsonwebtoken";

export async function POST(req:NextRequest) {
    const body = await req.json();
    try {
        const response = await client.user.create({
            data:{
                email:body.email,
                password:body.password
            }
        })

        const userId = response.id

        // const defaultTodoList = await client.todoList.create({
        //     data: {
        //       name: 'Default',
        //       user: {
        //         connect: { id: userId },
        //       },
        //     },
        //   });

        return NextResponse.json({response})
    }
    catch(e){
        console.log(e)
        if(e instanceof Error && e.message === "\nInvalid `prisma.user.create()` invocation:\n\n\nUnique constraint failed on the fields: (`email`)"){
            return NextResponse.json({
                error: "email is already there",
            },
        {
            status:411
        })
        }
        return NextResponse.json({
            error: e instanceof Error ? e.message : 'An unexpected error occurred',
        },
    {
        status:411
    })
       
    }
}