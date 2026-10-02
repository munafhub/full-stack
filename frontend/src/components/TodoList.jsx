// ============================================
// TodoList Component
// ============================================
// Renders the list of all todos.
// Receives todos array AND handler functions as props.
// REUSABLE - parent decides what data to show and what actions to take.

import TodoItem from './TodoItem.jsx';

const TodoList = ({ todos, onToggle, onDelete, onEdit }) => {
  // Show empty state if no todos
  if (todos.length === 0) {
    return (
      <div className="empty-state" data-testid="empty-state">
        <p className="empty-icon">📋</p>
        <p>No tasks yet!</p>
        <p className="empty-hint">Add a task above to get started 🚀</p>
      </div>
    );
  }

  return (
    <ul className="todo-list" data-testid="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </ul>
  );
};

export default TodoList;
