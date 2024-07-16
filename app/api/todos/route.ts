import { NextRequest, NextResponse } from "next/server";
import { fetchTodos, addATodo } from "@/data/firestore";

export async function GET(request: NextRequest) {
  const userId = request.headers.get('user-id');
  if (!userId) {
    console.log("Route Unauthorized", userId);
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const fetchedTodos = await fetchTodos(userId);
  const response = {
    message: 'User todos fetched successfully',
    data: fetchedTodos
  }

  return NextResponse.json(response, { status: 200 });
}

export async function POST(request: NextRequest) {
  const { title, userId } = await request.json();

  if (!title || !userId) {
    const errMessage = {
      message: 'Title and userId are required.'
    }
    return NextResponse.json(errMessage, { status: 422 });
  }

  const addedTodo = await addATodo({ title, userId });

  const response = {
    message: 'Todo added successfully',
    data: addedTodo
  }

  return NextResponse.json(response, { status: 201 });
}