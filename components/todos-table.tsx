'use client'

import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  PopoverTrigger,
  Popover,
  PopoverContent, Spinner
} from "@nextui-org/react";
import { Todo } from "@/types";
import { Button } from "@nextui-org/button";
import { useRouter } from "next/navigation";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// minified version is also included
// import 'react-toastify/dist/ReactToastify.min.css';

const TodosTable = ({ todos } : { todos: Todo[] }) => {

  // 할 일 추가 가능 여부
  const [todoAddEnable, setTodoAddEnable] = useState(false);

  // 입력된 할 일
  const [newTodoInput, setNewTodoInput] = useState('');

  // 로딩상태
  const [isLoading, setIsLoading] = useState<Boolean>(false);

  const router = useRouter();

  const addATodoHandler = async (title: string) => {

      if (!todoAddEnable) { return }

      setTodoAddEnable(false);
      setIsLoading(true);
      await new Promise(f => setTimeout(f, 300));
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/todos`, {
        method: 'post',
        body: JSON.stringify({
          title: title
        }),
        cache: 'no-store'
      })
    setNewTodoInput('');
    router.refresh();
    setIsLoading(false);
    notifyTodoAddedEvent("할 일이 추가되었어요!");
    console.log(`할 일 추가완료 : ${newTodoInput}`);
  };



  const DisabledTodoAddButton = () => {
    return <Popover placement="top" showArrow={true}>
      <PopoverTrigger>
        <Button color="default" className="h-14">
          추가
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="px-1 py-2">
          <div className="text-small font-bold">🙋🏻 할 일을 입력해주세요!</div>
          <div className="text-tiny"></div>
        </div>
      </PopoverContent>
    </Popover>
  }

  const TodoRow = (aTodo: Todo) => {
    return <TableRow key={aTodo.id}>
      <TableCell>{aTodo.id.slice(0, 4)}</TableCell>
      <TableCell>{aTodo.title}</TableCell>
      <TableCell>{aTodo.is_done ? "✅" : "❌"}</TableCell>
      <TableCell>{`${aTodo.created_at}`}</TableCell>
    </TableRow>
  }

  const notifyTodoAddedEvent = (msg: string) => toast.success(msg);

  return (
    <div className="flex flex-col space-y-2">
        <ToastContainer
          position="top-right"
          autoClose={1800}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark" />
      <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
        <Input type="text" label="새로운 할 일"
               value={newTodoInput}
               onValueChange={(changedInput) => {
                 setNewTodoInput(changedInput);
                 setTodoAddEnable(changedInput.length > 0);
               }}
        />
        {todoAddEnable ?
          <Button color="warning" className="h-14"
                  onPress={async () => {
                    await addATodoHandler(newTodoInput)
                  }}
          >
            추가
          </Button> :
          DisabledTodoAddButton()
        }
      </div>
      <div className="h-6">{isLoading && <Spinner size="sm" color="warning" />}</div>
      <Table aria-label="Example static collection table">
        <TableHeader>
          <TableColumn>아이디</TableColumn>
          <TableColumn>할 일 목록</TableColumn>
          <TableColumn>완료 여부</TableColumn>
          <TableColumn>생성일</TableColumn>
        </TableHeader>
        <TableBody emptyContent={"보여줄 데이터가 없습니다."}>
          {todos && todos.map((aTodo: Todo) => (
            TodoRow(aTodo)
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default TodosTable;