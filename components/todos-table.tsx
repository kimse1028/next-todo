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
  PopoverContent
} from "@nextui-org/react";
import { Todo } from "@/types";
import { Button } from "@nextui-org/button";

const TodosTable = ({ todos } : { todos: Todo[] }) => {

  // 할 일 추가 가능 여부
  const [todoAddEnable, setTodoAddEnable] = useState(false);

  // 입력된 할 일
  const [newTodoInput, setNewTodoInput] = useState('');

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

  return (
    <>
      <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
          <Input type="text" label="새로운 할 일"
              value={newTodoInput}
              onValueChange={(changedInput) => {
                setNewTodoInput(changedInput);
                setTodoAddEnable(changedInput.length > 0);
            }}
          />
        {todoAddEnable ?
          <Button color="warning" className="h-14">
            추가
          </Button> :
          DisabledTodoAddButton()
        }
      </div>
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
    </>
  );
}

export default TodosTable;