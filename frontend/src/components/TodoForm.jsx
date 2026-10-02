// ============================================
// TodoForm Component
// ============================================
// Handles adding new todos.
// Receives `onAdd` function as a prop from parent.
// This makes it REUSABLE - any parent can decide what happens on add.

import { useState } from 'react';

const TodoForm = ({ onAdd }) => {
  // Local state for the input field
  const [inputValue, setInputValue] = useState('');

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // prevent page reload
    if (inputValue.trim() === '') return;

    onAdd(inputValue); // call parent's function
    setInputValue(''); // clear input after adding
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="What needs to be done?"
        className="todo-input"
        data-testid="todo-input"
      />
      <button type="submit" className="btn btn-add" data-testid="add-button">
        + Add
      </button>
    </form>
  );
};

export default TodoForm;
