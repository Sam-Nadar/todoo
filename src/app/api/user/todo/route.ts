import jwt, { JwtPayload } from "jsonwebtoken";
import client from "@/app/db";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect";

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(req: NextRequest) {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    console.log("no token")
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  let decoded: JwtPayload;
  try {
    decoded = jwt.verify(token, JWT_SECRET!) as JwtPayload;
  } catch (error) {
    console.log("invalid token")
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }

  const userId = parseInt(decoded?.id,10);
  if (!userId) {
    console.log("user id not founf in token")
    return NextResponse.json({ message: 'User ID not found in token' }, { status: 400 });
  }

  try {
    // Fetch the user along with their todos
    const user = await client.user.findUnique({
      where: { id: userId }, // Use userId directly from the token
      include: {
        todos: {
          where: { userId: userId }, // Ensure only the todos for this user are included
        },
      },
    });

    if (!user) {
      console.log("user not found")
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user.todos);

  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}


export async function POST(req: NextRequest, { params }: { params: { todolist: string[] } }) {
  const body = await req.json();
  const cookieStore = cookies();
  let redirected = false

  const token = cookieStore.get("token")?.value;
  if (!token) {
    throw new Error("Token not found in cookies.");
  }

  try {
    var decoded = jwt.verify(token, JWT_SECRET!) as JwtPayload;
  } catch (error) {
    throw new Error("Invalid token.");
  }

  if (decoded.id) {
    const todos = body.todos;
    const userId = decoded.id;

    const validTodos = todos.filter(
      (todo: { title: string; description: string }) => todo.title.trim() && todo.description.trim()
    );

    // If there are no valid todos, respond with a message
    if (validTodos.length === 0) {
      return NextResponse.json({ message: 'No valid todos to create.' }, { status: 400 });
    }

    try {
      // Insert only the valid todos into the database
      const createdTodos = await client.todo.createMany({
        data: validTodos.map((todo: { title: string; description: string }) => ({
          title: todo.title,
          description: todo.description,
          completed: false, // Default completed status
          userId: userId, // Include userId if needed
        })),
      });

      redirected = true
    } catch (error) {
      console.error('Error creating todo:', error);
      return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
    if (redirected){
      console.log("inside redirected if")
      return redirect('/todo')
    }
  }
  
}