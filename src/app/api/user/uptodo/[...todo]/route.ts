import jwt, { JwtPayload } from "jsonwebtoken";
import client from "@/app/db";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const JWT_SECRET = process.env.JWT_SECRET;
export async function POST(req: NextRequest,{ params }: { params: { todolist: string[] } }) {
  const body = await req.json();
  const cookieStore = cookies();

  // const token = cookieStore.get("token")

  const token = cookieStore.get("token")?.value;
  if (!token) {
    throw new Error("Token not found in cookies.");
  }

  try {
    var decoded = jwt.verify(token, JWT_SECRET!) as JwtPayload;
  } catch (error) {
    throw new Error("Invalid token.");
  }

  if (decoded.id){
     // Dynamic segments
     const todos = body.todos
     const userId = decoded.id

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

      
      revalidatePath('/todo')
      redirect('/todo')
    } catch (error) {
      console.error('Error creating todo:', error);
      return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
  }
  }
  


  // export async function GET(req: NextRequest,{ params }: { params: { todo?: string[] } }) {
  //   const body = await req.json();
  //   const cookieStore = cookies();
  
  //   // const token = cookieStore.get("token")
  
  //   const token = cookieStore.get("token")?.value;
  //   if (!token) {
  //     throw new Error("Token not found in cookies.");
  //   }
  
  //   try {
  //     var decoded = jwt.verify(token, JWT_SECRET!) as JwtPayload;
  //   } catch (error) {
  //     throw new Error("Invalid token.");
  //   }
  
  //   if (decoded.id){
  //   const userId = decoded.id

  //     try {
  //       const user = await client.user.findUnique({
  //         where: { id: parseInt(userId, 10) },
  //             include: {
  //               todos: true, 
  //             }
  //       });
    
  //       if (!user) {
  //         return NextResponse.json({ message: 'User not found' }, { status: 404 });
  //       }
    
  //      const todos = user.todos
    
  //       return NextResponse.json(todos);
  //     } catch (error) {
  //       console.error('Error fetching todos:', error);
  //       return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  //     }

  //   }
  // }


  export async function PATCH(req: NextRequest, { params }: { params: { todo: string } }) {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;
    const body = await req.json();
    const { completed } = body; // Get 'completed' directly
    
    if (!token) {
      return NextResponse.json({ message: "Token not found in cookies." }, { status: 401 });
    }
  
    try {
      var decoded = jwt.verify(token, JWT_SECRET!) as JwtPayload;
    } catch (error) {
      return NextResponse.json({ message: "Invalid token." }, { status: 401 });
    }
  
    if (decoded.id) {
      const userId = decoded.id;
      if (!params?.todo || params.todo.length === 0) {
        return NextResponse.json({ message: "Todo ID not provided" }, { status: 400 });
      }
  
      const todoId = parseInt(params.todo[0]); // Extract the first element and convert to int
      if (isNaN(todoId)) {
        return NextResponse.json({ message: "Invalid Todo ID" }, { status: 400 });
      }
  
      try {
        // Find the todo by its ID and update its completion status
        const updatedTodo = await client.todo.update({
          where: { id: Number(todoId) },
          data: { completed },  // Update with the completed status
        });
  
        return NextResponse.json(updatedTodo, { status: 200 });
      } catch (error) {
        console.error('Error updating todo:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
      }
    }
  }
  

  export async function DELETE(req: NextRequest, { params }: { params: { todo?: string[] } }) {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;
  
    console.log("Params:", params); // Debugging log
  
    if (!token) {
      return NextResponse.json({ message: "Token not found in cookies." }, { status: 401 });
    }
  
    try {
      var decoded = jwt.verify(token, JWT_SECRET!) as JwtPayload;
    } catch (error) {
      return NextResponse.json({ message: "Invalid token." }, { status: 401 });
    }
  
    if (decoded.id) {
      // Ensure todo is valid
      if (!params?.todo || params.todo.length === 0) {
        return NextResponse.json({ message: "Todo ID not provided" }, { status: 400 });
      }
  
      const todoId = parseInt(params.todo[0]); // Extract the first element and convert to int
      if (isNaN(todoId)) {
        return NextResponse.json({ message: "Invalid Todo ID" }, { status: 400 });
      }
  
      try {
        await client.todo.delete({
          where: { id: todoId }, // Use the parsed integer value
        });
        return NextResponse.json({ message: "Todo deleted successfully" }, { status: 200 });
      } catch (error) {
        console.error('Error deleting todo:', error);
        return NextResponse.json({ message: "Failed to delete todo" }, { status: 500 });
      }
    }
  }
  
  
  
  
  