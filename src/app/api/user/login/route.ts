import client from "@/app/db";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log("inside login")

  try {
    // Fetch user based on email and password
    const user = await client.user.findUnique({
      where: {
        email: body.email,
        password: body.password, // In production, use hashed passwords and compare them
      },
    });

    // If user exists, generate JWT token
    if (user) {
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
        },
        JWT_SECRET!,
        // { expiresIn: "1h" } // Token expires in 1 hour
      );

      // Set the token in a secure, HttpOnly cookie
      const response = NextResponse.json({
        message: "Login successful",
        user: { id: user.id, email: user.email }, // Send only non-sensitive user info
      });
       
      cookies().set('token', token, { secure: true })

    //   response.cookies.set("auth-token", token, {
    //     httpOnly: true,
    //     secure: process.env.NODE_ENV === "production", // Ensure secure cookies in production
    //     sameSite: "strict",
    //     path: "/",
    //   });

      return response;
    } else {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { message: "Error while logging in" },
      { status: 500 }
    );
  }
}
