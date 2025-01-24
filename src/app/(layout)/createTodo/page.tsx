"use client"
import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';

const TodoForm = () => {
  // State to store the list of todos
  const [todos, setTodos] = useState([{ title: '', description: '' }]);

  // Function to handle adding a new input set (for title and description)
  const addTodoFields = () => {
    setTodos([...todos, { title: '', description: '' }]);
  };

  // Function to handle input changes
  const handleInputChange = (
    index: number,
    field: 'title' | 'description', // Explicitly define field type
    value: string
  ) => {
    const newTodos = [...todos];
    newTodos[index][field] = value; // Use field as 'title' or 'description'
    setTodos(newTodos);
  };

  // Function to handle submitting todos
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/user/todo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ todos }), // Wrap todos in an object
      });
    
      if (response.ok) {
        console.log('Todos submitted successfully');
        window.location.href = '/todo';

        // Reset form after submission
        setTodos([{ title: '', description: '' }]); // Ensure this is the correct reset logic
      } else {
        console.error('Failed to submit todos');
      }
    } catch (error) {
      console.error('Error submitting todos:', error);
    }
    
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      {todos.map((todo, index) => (
        <div key={index} className="mb-4">
          <input
            type="text"
            placeholder="Title"
            value={todo.title}
            onChange={(e) => handleInputChange(index, 'title', e.target.value)}
            className="block w-full mb-2 p-2 border text-black border-gray-300 rounded"
            required
          />
          <textarea
            placeholder="Description"
            value={todo.description}
            onChange={(e) =>
              handleInputChange(index, 'description', e.target.value)
            }
            className="block w-full mb-2 p-2 border border-gray-300 text-black rounded"
            rows={4}
            required
          />
        </div>
      ))}

      {/* Add more fields */}
      <div className="flex items-center mb-4">
        <FaPlus
          onClick={addTodoFields}
          className="text-green-500 cursor-pointer text-2xl"
        />
        <span className="ml-2 text-gray-500">Add another todo</span>
      </div>

      {/* Submit button */}
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Submit
      </button>
    </form>
  );
};

export default TodoForm;
