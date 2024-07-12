import { title } from "@/components/primitives";
import TodosTable from "@/components/todos-table"
import ProtectedRoute from "@/components/ProtectedRoute";

async function fetchTodosApiCall() {
  console.log("fetchTodosApiCall called");
  const res = await fetch(`${process.env.BASE_URL}/api/todos/`, { cache: 'no-store' })
  return res.json();
}

export default async function TodosPage() {

  const response = await fetchTodosApiCall();

  return (
    <ProtectedRoute>
      <div className="flex flex-col space-y-8">
        <h1 className={title()}>Todos</h1>
        <TodosTable todos={response.data ?? []} />
      </div>
    </ProtectedRoute>
  );
}
