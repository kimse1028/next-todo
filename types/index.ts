import { SVGProps } from "react";
import { Timestamp } from "firebase/firestore";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type Todo = {
  id: string;
  title: string;
  is_done: boolean;
  created_at: Date;
  userId: string;
}

export type CustomModalType = 'detail' | 'edit' | 'delete'

export type FocusedTodoType = {
  focusedTodo: Todo | null,
  modalType: CustomModalType
}