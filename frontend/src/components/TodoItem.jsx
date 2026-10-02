// ============================================
// TodoItem Component
// ============================================
// Displays a SINGLE todo with actions: toggle, edit, delete.
// Receives the todo data AND handler functions as props.
// This makes it REUSABLE - parent decides what happens.

import { useState } from 'react';

const TodoItem = ({ todo, onToggle, onDelete, onEdit }) => {
  // State for edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.title);

  // Save edit
  const handleSave = () => {
    if (editText.trim() === '') return;
    onEdit(todo.id, editText);
    setIsEditing(false);
  };

  // Cancel edit
  const handleCancel = () => {
    setEditText(todo.title);
    setIsEditing(false);
  };

  // Handle Enter/Escape keys in edit mode
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') handleCancel();
  };

  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      {/* Checkbox to toggle */}
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className="todo-checkbox"
        data-testid="toggle-button"
      />

      {/* Text or Edit Input */}
      {isEditing ? (
        <div className="edit-container">
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyDown}
            className="edit-input"
            autoFocus
            data-testid="edit-input"
          />
          <button onClick={handleSave} className="btn btn-save">✓</button>
          <button onClick={handleCancel} className="btn btn-cancel">✗</button>
        </div>
      ) : (
        <span className="todo-text">{todo.title}</span>
      )}

      {/* Action buttons (only show when not editing) */}
      {!isEditing && (
        <div className="todo-actions">
          <button
            onClick={() => setIsEditing(true)}
            className="btn btn-edit"
            data-testid="edit-button"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(todo.id)}
            className="btn btn-delete"
            data-testid="delete-button"
          >
            🗑️
          </button>
        </div>
      )}
    </li>
  );
};

export default TodoItem;
