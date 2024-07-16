'use client'

import { title } from "@/components/primitives";
import TodosTable from "@/components/todos-table"
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";

function TodosPage() {
  const [todos, setTodos] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchTodos() {
      if (user) {
        const token = await user.getIdToken();
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/todos/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        setTodos(data.data);
      }
    }

    fetchTodos();
  }, [user]);

  return (
    <ProtectedRoute>
      <div className="flex flex-col space-y-8">
        <h1 className={title()}>Todos</h1>
        <TodosTable todos={todos} />
      </div>
    </ProtectedRoute>
  );
}

export default TodosPage;