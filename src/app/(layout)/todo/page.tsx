import client from "@/app/db"; 
import TodoGrid from "@/components/todoComp"; 
import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
const JWT_SECRET = process.env.JWT_SECRET;

const TadooPage = async () => {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    console.log("no token");
   
    return <div>Unauthorized</div>; // Simple UI message
  }

  let decoded: JwtPayload;
  try {
    decoded = jwt.verify(token, JWT_SECRET!) as JwtPayload;
  } catch (error) {
    console.log("invalid token");
    return <div>Invalid token</div>; // Simple UI message
  }

  const userId = parseInt(decoded?.id, 10);
  console.log(userId);
  if (!userId) {
    console.log("user id not found in token");
    return <div>User ID not found in token</div>; // Simple UI message
  }

  try {
    // Fetch todos for the specified user
    const todos = await client.todo.findMany({
      where: {
        userId: userId, // Filter by userId
      },
    },
  );
  
  

    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Your Todos</h1>
        <TodoGrid initialTodos={todos} /> {/* Pass fetched todos to TodoGrid */}
      </div>
    );

    window.location.reload()
  } catch (error) {
    console.error(error);
    return <div>Failed to load todos</div>; // Simple UI message
  }
};

// This function is used to set cache headers to disable caching
export async function headers() {
  return {
    'Cache-Control': 'no-store', // Disables caching
  };
}

export default TadooPage;
