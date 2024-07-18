import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

const db = admin.firestore();


// 모든 할 일 조회
export const getAllTodos = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const userId = context.auth.uid;
  const todosRef = db.collection('todos');
  const snapshot = await todosRef.where('userId', '==', userId).orderBy('created_at', 'desc').get();

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
});

// 할 일 추가
export const addTodo = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { title } = data;
  const userId = context.auth.uid;

  const newTodo = {
    title,
    is_done: false,
    created_at: admin.firestore.FieldValue.serverTimestamp(),
    userId
  };

  const docRef = await db.collection('todos').add(newTodo);
  return { id: docRef.id, ...newTodo };
});

// 할 일 수정
export const updateTodo = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { id, title, is_done } = data;
  await db.collection('todos').doc(id).update({ title, is_done });
  return { message: 'Todo updated successfully' };
});

// 할 일 삭제
export const deleteTodo = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { id } = data;
  await db.collection('todos').doc(id).delete();
  return { message: 'Todo deleted successfully' };
});