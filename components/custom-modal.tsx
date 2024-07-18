'use client'

import React, { useState } from "react";
import {
  Input, ModalContent, ModalHeader, ModalBody, ModalFooter, Switch, CircularProgress
} from "@nextui-org/react";
import { CustomModalType, Todo } from "@/types";
import { Button } from "@nextui-org/button";

const CustomModal = ({ focusedTodo, modalType, onClose, onEdit, onDelete } : {
  focusedTodo: Todo,
  modalType: CustomModalType,
  onClose: () => void,
  onEdit: (id: string, title: string, isDone: boolean) => void,
  onDelete: (id: string) => void
}) => {

  // 로딩상태
  const [isLoading, setIsLoading] = useState<Boolean>(false);

  // 수정된 선택
  const [isDone, setIsDone] = useState(focusedTodo.is_done);

  // 수정된 할 일 입력
  const [editedTodoInput, setEditedTodoInput] = useState<String>(focusedTodo.title);

  const DetailModal = () => {
    return  <>
      <ModalHeader className="flex flex-col gap-1">할 일 상세</ModalHeader>
      <ModalBody>
        <p><span className="font-bold">id :</span>{focusedTodo.id}</p>
        <p><span className="font-bold">할 일 내용 :</span>{focusedTodo.title}</p>
        <div className="flex py-2 px-1 space-x-2">
          <span className="font-bold">완료여부</span>
          <Switch isDisabled defaultSelected={focusedTodo.is_done}
                  onValueChange={setIsDone}
                  color="warning"
                  aria-label="Automatic updates">
          </Switch>
          {`${isDone ? "완료" : "미완료"}`}
        </div>
        <div className="flex py-2 px-1 space-x-2">
          <span className="font-bold">작성일 : </span>
          <p>{`${focusedTodo.created_at}`}</p>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="default" variant="light" onPress={onClose}>
          닫기
        </Button>
      </ModalFooter>
    </>
  }

  const EditModal = () => {
    return <>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">할 일 수정</ModalHeader>
            <ModalBody>
              <p><span className="font-bold">id :</span>{focusedTodo.id}</p>
              <Input
                autoFocus
                label="할 일 내용"
                placeholder="할 일을 입력하세요"
                variant="bordered"
                isRequired
                defaultValue={focusedTodo.title}
                value={editedTodoInput.toString()}
                onValueChange={setEditedTodoInput}
              />
              <div className="flex py-2 px-1 space-x-2">
                <span className="font-bold">완료여부</span>
                <Switch defaultSelected={focusedTodo.is_done}
                        onValueChange={setIsDone}
                        color="warning"
                        aria-label="Automatic updates">
                </Switch>
                {`${isDone ? '완료' : '미완료'}`}
              </div>
              <div className="flex py-2 px-1 space-x-2">
                <span className="font-bold">작성일 : </span>
                <p>{`${focusedTodo.created_at}`}</p>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="warning" variant="flat" onPress={() => {
                setIsLoading(true);
                onEdit(focusedTodo.id, editedTodoInput.toString(), isDone);
              }}>
                {(isLoading) ? <CircularProgress color="warning" size="sm" aria-label="Loading..."/> : "수정"}
              </Button>
              <Button color="default" onPress={onClose}>
                닫기
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </>
  }

  const DeleteModal = () => {
    return  <>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">할 일 삭제</ModalHeader>
            <ModalBody>
              <p><span className="font-bold">id :</span>{focusedTodo.id}</p>
              <p><span className="font-bold">할 일 내용 :</span>{focusedTodo.title}</p>
              <div className="flex py-2 px-1 space-x-2">
                <span className="font-bold">완료여부</span>
                <Switch isDisabled defaultSelected={focusedTodo.is_done}
                        onValueChange={setIsDone}
                        color="warning"
                        aria-label="Automatic updates">
                </Switch>
                {`${isDone ? "완료" : "미완료"}`}
              </div>
              <div className="flex py-2 px-1 space-x-2">
                <span className="font-bold">작성일 : </span>
                <p>{`${focusedTodo.created_at}`}</p>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={() => {
                setIsLoading(true);
                onDelete(focusedTodo.id);
              }}>
                {(isLoading) ? <CircularProgress color="danger" size="sm" aria-label="Loading..."/> : "삭제"}
              </Button>
              <Button color="default" onPress={onClose}>
                닫기
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </>
  }

  const getModal = (Type: CustomModalType) => {
    switch (Type) {
      case 'detail':
        return DetailModal();
      case 'delete':
        return DeleteModal();
      case 'edit':
        return EditModal();
      default: break;
    }
  }

  return (
    <>
      { getModal(modalType) }
    </>
  )
}

export default CustomModal;