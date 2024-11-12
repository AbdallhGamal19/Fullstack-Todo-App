import Button from "./ui/Button.tsx";
import useCustomQuery from "../hooks/useAuthenticatedQuery.ts";
import Modal from "./ui/Modal.tsx";
import { ChangeEvent, FormEvent, useState } from "react";
import Input from "./ui/Input.tsx";
import { ITodo } from "../interfaces/index.ts";
import Textarea from "./ui/Textarea.tsx";
import axiosInstance from "../config/axios.config.ts";
import TodoSkeleton from "./TodoSkeleton.tsx";
import { faker } from "@faker-js/faker";
//interface IProps {}

const TodoList = () => {
  const storageKey = "userData";
  const userDataString = localStorage.getItem(storageKey);
  const userData = userDataString ? JSON.parse(userDataString) : null;

  //state
  const [queryVersion, setQueryVersion] = useState(1);
  const [isOpenEditModel, setisOpenEditModel] = useState<boolean>(false);
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false);
  const [isOpenAddedModel, setIsOpenAddedModel] = useState<boolean>(false);
  const [isUpdated, setisUpdated] = useState<boolean>(false);
  const [todoToAdd, setTodoToAdd] = useState({
    title: "",
    description: "",
  });
  const [todoToEdit, setTodoToEdit] = useState<ITodo>({
    id: 0,
    documentId: "",
    title: "",
    description: "",
  });

  //fetch data

  const { isLoading, data } = useCustomQuery({
    queryKey: ["todoList", `${queryVersion}`],
    url: "/users/me?populate=todos",
    config: {
      headers: {
        Authorization: `Bearer ${userData.jwt}`,
      },
    },
  });

  //Handlers
  const closeAddModel = () => {
    setTodoToAdd({
      title: "",
      description: "",
    });
    setIsOpenAddedModel(false);
  };
  const openAddModel = () => {
    setIsOpenAddedModel(true);
  };
  const closeConfirmModal = () => {
    setTodoToEdit({
      id: 0,
      documentId: "",
      title: "",
      description: "",
    });
    setIsOpenConfirmModal(false);
  };
  const openConfirmModal = (todo: ITodo) => {
    setTodoToEdit(todo);
    setIsOpenConfirmModal(true);
  };
  const openEditModel = (todo: ITodo) => {
    setisOpenEditModel(true);
    setTodoToEdit(todo);
  };
  const closeEditModel = () => {
    setisOpenEditModel(false);
    setTodoToEdit({
      id: 0,
      documentId: "",
      title: "",
      description: "",
    });
  };
  const onGeneratyTodosHandler = async () => {
    for (let i = 0; i < 100; i++) {
      try {
        await axiosInstance.post(
          `/todos`,
          {
            data: {
              title: faker.word.words(3),
              description: faker.lorem.paragraph(2),
              user: [userData.user.documentId],
            },
          },
          {
            headers: {
              Authorization: `Bearer ${userData.jwt}`,
            },
          }
        );
      } catch (error) {
        console.log(error);
      }
    }
  };
  const onRemoveHandler = async () => {
    try {
      const { status } = await axiosInstance.delete(
        `/todos/${todoToEdit.documentId}`,

        {
          headers: {
            Authorization: `Bearer ${userData.jwt}`,
          },
        }
      );
      if (status == 200) {
        setQueryVersion((prev) => prev + 1);
        closeConfirmModal();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setisUpdated(false);
    }
  };
  const onChangeHandler = (
    evt: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = evt.target;
    setTodoToEdit({
      ...todoToEdit,
      [name]: value,
    });
  };
  const onChangeAddHandler = (
    evt: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = evt.target;
    setTodoToAdd({
      ...todoToAdd,
      [name]: value,
    });
  };
  const onSubmitAddHanler = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    const { title, description } = todoToAdd;
    setisUpdated(true);
    try {
      const { status } = await axiosInstance.post(
        `/todos`,
        { data: { title, description, user: [userData.user.documentId] } },
        {
          headers: {
            Authorization: `Bearer ${userData.jwt}`,
          },
        }
      );

      if (status == 201) {
        setQueryVersion((prev) => prev + 1);
        closeAddModel();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setisUpdated(false);
    }
  };
  const onSubmitHanler = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    const { title, description } = todoToEdit;
    setisUpdated(true);
    try {
      const { status } = await axiosInstance.put(
        `/todos/${todoToEdit.documentId}`,
        { data: { title, description } },
        {
          headers: {
            Authorization: `Bearer ${userData.jwt}`,
          },
        }
      );
      if (status == 200) {
        setQueryVersion((prev) => prev + 1);
        closeEditModel();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setisUpdated(false);
    }
  };

  if (isLoading)
    return (
      <div className="space-y-1 p-3">
        {Array.from({ length: 3 }, (_, idx) => (
          <TodoSkeleton key={idx} />
        ))}{" "}
      </div>
    );
  return (
    <div className="space-y-1">
      <div className="flex w-fit mx-auto my-10 gap-x-2">
        <Button variant="default" size={"sm"} onClick={openAddModel}>
          Post new todo
        </Button>
        <Button variant="outline" size={"sm"} onClick={onGeneratyTodosHandler}>
          Generate todos
        </Button>
      </div>
      {data.todos.length
        ? data.todos.map((todo: ITodo, idx: number) => (
            <div
              key={todo.id}
              className="flex items-center justify-between hover:bg-gray-100 duration-300 p-3 rounded-md even:bg-gray-100"
            >
              <p className="w-full font-semibold">
                {idx + 1} - {todo.title}
              </p>
              <div className="flex items-center justify-end w-full space-x-3">
                <Button
                  variant={"default"}
                  size={"sm"}
                  onClick={() => openEditModel(todo)}
                >
                  Edit
                </Button>
                <Button
                  variant={"danger"}
                  size={"sm"}
                  onClick={() => openConfirmModal(todo)}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))
        : "No todos yet!"}
      {/* {Add todo model} */}
      <Modal
        isOpen={isOpenAddedModel}
        closeModal={closeAddModel}
        title="Edit Todo"
      >
        <form className="space-y-2" onSubmit={onSubmitAddHanler}>
          <Input
            name="title"
            value={todoToAdd.title}
            onChange={onChangeAddHandler}
          />
          <Textarea
            name="description"
            value={todoToAdd.description}
            onChange={onChangeAddHandler}
          />
          <div className="flex items-center space-x-3 mt-4">
            <Button
              isLoading={isUpdated}
              className="bg-indigo-700 hover:bg-indigo-800"
              //isLoading={isUpdating}
            >
              Done
            </Button>
            <Button type="button" onClick={closeAddModel}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
      {/* {Edit todo model} */}
      <Modal
        isOpen={isOpenEditModel}
        closeModal={closeEditModel}
        title="Edit Todo"
      >
        <form className="space-y-2" onSubmit={onSubmitHanler}>
          <Input
            name="title"
            value={todoToEdit.title}
            onChange={onChangeHandler}
          />
          <Textarea
            name="description"
            value={todoToEdit.description}
            onChange={onChangeHandler}
          />
          <div className="flex items-center space-x-3 mt-4">
            <Button
              isLoading={isUpdated}
              className="bg-indigo-700 hover:bg-indigo-800"
              //isLoading={isUpdating}
            >
              Update
            </Button>
            <Button type="button" onClick={closeEditModel}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
      {/* Delete todo Modal */}
      <Modal
        isOpen={isOpenConfirmModal}
        closeModal={closeConfirmModal}
        title="Are you sure you want to remove this todo from your store ?"
        description="Deleting this todo will remove it permenantly from your inventory. Any associated data, sales history, and other related information will also be deleted. Please make sure this is the intended action."
      >
        <div className="flex items-center space-x-3 mt-4">
          <Button variant="danger" onClick={() => onRemoveHandler()}>
            Yes , Remove
          </Button>
          <Button variant="cancel" type="button" onClick={closeConfirmModal}>
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default TodoList;
