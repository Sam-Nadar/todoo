import React, { useState } from 'react';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

interface ExpandableCardProps {
  todo: Todo;
}

const ExpandableCard: React.FC<ExpandableCardProps> = ({ todo }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDestroyed, setIsDestroyed] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  const toggleCard = () => {
    if (!isDestroyed) {
      setIsExpanded(!isExpanded);
    }
  };

  const handleDestroy = () => {
    setIsDestroyed(true);
    setTimeout(() => {
      setIsHidden(true);
    }, 500);
  };

  if (isHidden) return null;

  return (
    <div
      onClick={toggleCard}
      className={`relative cursor-pointer bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden transition-all duration-300 ${isExpanded ? 'w-auto h-auto p-4' : 'w-64 h-32 p-4'} ${isDestroyed ? 'animate-fade-out' : ''}`}
    >
      <input
        type="checkbox"
        className="absolute top-2 right-2 form-checkbox h-5 w-5 text-indigo-600"
        checked={todo.completed}
        onClick={(e) => e.stopPropagation()}
      />
      <div className="absolute top-2 left-2" onClick={handleDestroy}>
        🗑️ {/* Add a delete icon here */}
      </div>
      <div className="text-gray-800">
        {isExpanded ? (
          <p>{todo.title}</p>
        ) : (
          <p>{todo.title.substring(0, 20)}...</p>
        )}
      </div>
    </div>
  );
};

export default ExpandableCard;
