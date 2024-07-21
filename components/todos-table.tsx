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
  PopoverContent,
  Spinner,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalContent,
  useDisclosure,
  Card,
  CardBody
} from "@nextui-org/react";
import { CustomModalType, FocusedTodoType, Todo } from "@/types";
import { Button } from "@nextui-org/button";
import { useRouter } from "next/navigation";
import { VerticalDotsIcon } from "./icons";

import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '@/lib/firebase';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CustomModal from "@/components/custom-modal";
import { useAuth } from "@/contexts/AuthContext";

const TodosTable = ({ todos }: { todos: Todo[] }) => {
  const functions = getFunctions(app);
  const [todoAddEnable, setTodoAddEnable] = useState(false);
  const [newTodoInput, setNewTodoInput] = useState('');
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [currentModalData, setCurrentModalData] = useState<FocusedTodoType>({
    focusedTodo: null,
    modalType: 'detail' as CustomModalType
  });

  const router = useRouter();
  const refreshPage = () => {
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const { user } = useAuth();

  const addTodoWithFunctions = async (title: string) => {
    if (!todoAddEnable) {
      return;
    }
    if (!title.trim() || !user) return;

    setTodoAddEnable(false);
    setIsLoading(true);

    try {
      await new Promise(f => setTimeout(f, 300));

      const addTodoFunction = httpsCallable(functions, 'addTodo');
      const result = await addTodoFunction({ title });

      console.log(result.data);
      setNewTodoInput('');
      router.refresh();
      refreshPage();
      notifySuccessAddedEvent("할 일이 추가되었어요! (Firebase Functions)");
      console.log(`할 일 추가완료 (Firebase Functions) : ${title}`);
    } catch (error) {
      console.error("Firebase Function 호출 중 오류 발생:", error);
      notifyErrorEvent("할 일 추가 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const addATodoHandler = async (title: string) => {
    if (!todoAddEnable) {
      return
    }
    if (!newTodoInput.trim() || !user) return;

    setTodoAddEnable(false);
    setIsLoading(true);
    await new Promise(f => setTimeout(f, 300));
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/todos`, {
      method: 'post',
      body: JSON.stringify({
        title: title,
        userId: user.uid
      }),
      cache: 'no-store'
    });

    setNewTodoInput('');
    router.refresh();
    refreshPage();
    setIsLoading(false);
    notifySuccessAddedEvent("할 일이 추가되었어요! (Next.js API)");
    console.log(`할 일 추가완료 : ${newTodoInput}`);
  };

  const editATodoFunctionsHandler = async (
      id: string,
      editedTitle: string,
      editedIsDone: boolean
  ) => {
    setIsLoading(true);

    try {
      await new Promise(f => setTimeout(f, 100));

      const updateTodoFunction = httpsCallable(functions, 'updateTodo');
      const result = await updateTodoFunction({ id, title: editedTitle, is_done: editedIsDone });

      console.log(result.data);

      notifySuccessAddedEvent("할 일이 수정되었어요! (Firebase Functions)");
      console.log(`할 일 수정완료 (Firebase Functions): ${editedTitle}`);

      refreshPage();
    } catch (error) {
      console.error("Firebase Function 호출 중 오류 발생:", error);
      notifyErrorEvent("할 일 수정 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const editATodoHandler = async (
      id: string,
      editedTitle: string,
      editedIsDone: boolean) => {

    await new Promise(f => setTimeout(f, 1000));
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/todos/${id}`, {
      method: 'post',
      body: JSON.stringify({
        title: editedTitle,
        is_done: editedIsDone
      }),
      cache: 'no-store'
    });

    router.refresh();
    refreshPage();
    notifySuccessAddedEvent("할 일이 수정되었어요! (Next.js API)");
    console.log(`할 일 수정완료 : ${newTodoInput}`);
  };

  const deleteATodoFunctionsHandler = async (id: string) => {
    setIsLoading(true);

    try {
      await new Promise(f => setTimeout(f, 100));

      const deleteTodoFunction = httpsCallable(functions, 'deleteTodo');
      const result = await deleteTodoFunction({ id });

      console.log(result.data);

      notifySuccessAddedEvent("할 일이 삭제되었어요! (Firebase Functions)");
      console.log(`할 일 삭제완료 (Firebase Functions): ${id}`);

      refreshPage();
    } catch (error) {
      console.error("Firebase Function 호출 중 오류 발생:", error);
      notifyErrorEvent("할 일 삭제 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteATodoHandler = async (id: string) => {
    await new Promise(f => setTimeout(f, 1000));
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/todos/${id}`, {
      method: 'delete',
      cache: 'no-store'
    });

    router.refresh();
    refreshPage();
    notifySuccessAddedEvent("할 일이 삭제되었어요! (Next.js API)");
    console.log(`할 일 삭제완료 : ${newTodoInput}`);
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

  const applyIsDoneUI = (isDone: boolean) =>
      (isDone ? "line-through text-gray-900/50 dark:text-white/40" : "")

  const TodoItem = (aTodo: Todo) => {
    return (
        <Card key={aTodo.id} className="w-full mb-4">
          <CardBody>
            <div className={`text-lg font-semibold mb-2 ${applyIsDoneUI(aTodo.is_done)}`}>{aTodo.title}</div>
            <div className="text-sm text-gray-500 mb-2">
              {new Date(aTodo.created_at).toLocaleDateString()}
            </div>
            <div className="flex justify-end">
              <Dropdown>
                <DropdownTrigger>
                  <Button isIconOnly size="sm" variant="light">
                    <VerticalDotsIcon className="text-default-300" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu onAction={(key) => {
                  setCurrentModalData({
                    focusedTodo: aTodo,
                    modalType: key as CustomModalType
                  })
                  onOpen();
                }}>
                  <DropdownItem key="detail">상세보기</DropdownItem>
                  <DropdownItem key="edit">수정</DropdownItem>
                  <DropdownItem key="delete">삭제</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </CardBody>
        </Card>
    );
  };

  const notifySuccessAddedEvent = (msg: string) => toast.success(msg);
  const notifyErrorEvent = (msg: string) => toast.warning(msg);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const ModalComponent = () => {
    return <Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
            (currentModalData.focusedTodo &&
                <CustomModal focusedTodo={currentModalData.focusedTodo}
                             modalType={currentModalData.modalType}
                             onClose={onClose}
                             onEdit={async (id, title, isDone) => {
                               console.log(id, title, isDone);
                               await editATodoHandler(id, title, isDone);
                               onClose();
                             }}
                             onEditFunctions={async (id, title, isDone) => {
                               console.log(id, title, isDone);
                               await editATodoFunctionsHandler(id, title, isDone);
                               onClose();
                             }}
                             onDelete={async (id) => {
                               console.log("onDelete / id:", id);
                               await deleteATodoHandler(id);
                               onClose();
                             }}
                             onDeleteFunctions={async (id) => {
                               console.log("onDelete / id:", id);
                               await deleteATodoFunctionsHandler(id);
                               onClose();
                             }}
                />)
        )}
      </ModalContent>
    </Modal>
  }

  return (
      <div className="flex flex-col space-y-2">
        <ModalComponent />
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
                Next.js API
              </Button> :
              DisabledTodoAddButton()
          }
          {todoAddEnable ?
              <Button color="warning" className="h-14"
                      onPress={async () => {
                        await addTodoWithFunctions(newTodoInput)
                      }}
              >
                Functions
              </Button> :
              DisabledTodoAddButton()
          }
        </div>
        <div className="h-6">{isLoading && <Spinner size="sm" color="warning" />}</div>

        {/* 반응형 테이블/카드 뷰 */}
        <div className="hidden md:block"> {/* 데스크탑 뷰 */}
          <Table aria-label="Example static collection table">
            <TableHeader>
              <TableColumn>고유번호</TableColumn>
              <TableColumn>할 일 목록</TableColumn>
              <TableColumn>생성일</TableColumn>
              <TableColumn>액션</TableColumn>
            </TableHeader>
            <TableBody emptyContent={"보여줄 데이터가 없습니다."}>
              {todos && todos.map((aTodo: Todo) => (
                  <TableRow key={aTodo.id}>
                    <TableCell className={applyIsDoneUI(aTodo.is_done)}>{aTodo.id.slice(0, 4)}</TableCell>
                    <TableCell className={`${applyIsDoneUI(aTodo.is_done)} max-w-xs truncate`}>{aTodo.title}</TableCell>
                    <TableCell className={applyIsDoneUI(aTodo.is_done)}>{new Date(aTodo.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="relative flex justify-end items-center gap-2">
                        <Dropdown>
                          <DropdownTrigger>
                            <Button isIconOnly size="sm" variant="light">
                              <VerticalDotsIcon className="text-default-300" />
                            </Button>
                          </DropdownTrigger>
                          <DropdownMenu onAction={(key) => {
                            console.log(`aTodo.id : ${aTodo.id} / key: ${key}`);
                            setCurrentModalData({
                              focusedTodo: aTodo,
                              modalType: key as CustomModalType
                            })
                            onOpen();
                          }}>
                            <DropdownItem key="detail">상세보기</DropdownItem>
                            <DropdownItem key="edit">수정</DropdownItem>
                            <DropdownItem key="delete">삭제</DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </div>
                    </TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="md:hidden"> {/* 모바일 뷰 */}
          {todos && todos.map(TodoItem)}
        </div>
      </div>
  );
}

export default TodosTable;