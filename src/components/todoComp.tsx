'use client'; // Required for using hooks like useState in the app directory

import React, { useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import { useRouter } from "next/navigation";

interface Todo {
  id: number;
  title: string;
  description?: string; // Optional if you might not have descriptions
  completed: boolean;
}

export interface TodoGridProps {
  initialTodos: Todo[];
}

const TodoGrid: React.FC<TodoGridProps> = ({ initialTodos }) => {
  const router = useRouter();
  const [todos, setTodos] = useState<Todo[]>(initialTodos); // Manage todos in state

  // Function to handle deleting a todo
  const handleDelete = async (todoId: number) => {
    try {
      const response = await fetch(`/api/user/uptodo/${todoId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove the todo from the UI after successful deletion
        setTodos(todos.filter((todo) => todo.id !== todoId)); // Remove the deleted todo
      } else {
        console.error('Failed to delete todo');
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  // Function to handle toggling the completed state of a todo
  const handleToggleComplete = async (todoId: number, completed: boolean) => {
    try {
      const response = await fetch(`/api/user/uptodo/${todoId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !completed }),
      });
  
      if (response.ok) {
        router.refresh(); // This will re-fetch the page data
      } else {
        console.error('Failed to update todo');
      }
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };
  

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      {todos.map((todo) => (
        <div
          key={todo.id}
          className="relative bg-white border border-gray-300 rounded-lg shadow-md p-4 h-auto lg:h-64 overflow-hidden lg:overflow-auto"
        >
          {/* Ensure the title has black color */}
          <div className="text-lg font-bold mb-2 text-black">{todo.title}</div>
          <div className="text-gray-800 mb-4 lg:h-24 lg:overflow-y-auto">
            {todo.description || "No description available"} {/* Add default text */}
          </div>

          {/* Checkbox for marking todo as completed */}
          <div className="absolute bottom-2 left-2">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-indigo-600"
              checked={todo.completed}
              onChange={() => handleToggleComplete(todo.id, todo.completed)}
            />
          </div>

          {/* Trash icon for deleting the todo */}
          <div className="absolute bottom-2 right-2">
            <FaTrash
              className="text-red-600 cursor-pointer"
              onClick={() => handleDelete(todo.id)}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default TodoGrid;
