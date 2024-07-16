import { NextRequest, NextResponse } from "next/server";
import { fetchTodos, addATodo } from "@/data/firestore";
import { auth } from '@/lib/firebaseAdmin';

async function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await auth.verifyIdToken(token);
    return decodedToken.uid;
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  const userId = await verifyToken(request);
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