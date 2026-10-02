import { useEffect, useState } from 'react';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import TodoForm from './components/TodoForm.jsx';
import TodoList from './components/TodoList.jsx';
import AuthForm from './components/AuthForm.jsx';
import { api } from './api.js';

const App = () => {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; }
  });
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const loadTasks = async () => {
    setLoading(true);
    try {
      setTodos(await api.tasks());
      setError('');
    } catch (err) {
      setError(err.message);
      if (err.message.includes('Authentication')) logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) loadTasks();
  }, [user]);

  const handleLogin = (data) => {
    localStorage.setItem('jwt', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
  };

  function logout() {
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
    setUser(null);
    setTodos([]);
  }

  const addTodo = async (text) => {
    if (!text.trim()) return;
    try {
      const task = await api.createTask({ title: text.trim(), completed: false });
      setTodos((current) => [task, ...current]);
    } catch (err) { setError(err.message); }
  };

  const toggleTodo = async (id) => {
    const todo = todos.find((item) => item.id === id);
    if (!todo) return;
    try {
      const updated = await api.updateTask(id, { completed: !todo.completed });
      setTodos((current) => current.map((item) => item.id === id ? updated : item));
    } catch (err) { setError(err.message); }
  };

  const editTodo = async (id, newText) => {
    if (!newText.trim()) return;
    try {
      const updated = await api.updateTask(id, { title: newText.trim() });
      setTodos((current) => current.map((item) => item.id === id ? updated : item));
    } catch (err) { setError(err.message); }
  };

  const deleteTodo = async (id) => {
    try {
      await api.deleteTask(id);
      setTodos((current) => current.filter((item) => item.id !== id));
    } catch (err) { setError(err.message); }
  };

  if (!user) return <AuthForm onLogin={handleLogin} />;

  const remainingCount = todos.filter((todo) => !todo.completed).length;

  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <div className="content-wrapper">
          <div className="user-bar">
            <span>Logged in as <strong>{user.name}</strong> ({user.role})</span>
            <button className="logout-button" onClick={logout}>Logout</button>
          </div>
          {error && <div className="error-message">{error}</div>}
          <TodoForm onAdd={addTodo} />
          {loading ? <p>Loading tasks...</p> : null}
          {todos.length > 0 && (
            <div className="stats-bar">
              <span>📌 {remainingCount} remaining</span>
              <span>✅ {todos.length - remainingCount} completed</span>
            </div>
          )}
          <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} onEdit={editTodo} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
