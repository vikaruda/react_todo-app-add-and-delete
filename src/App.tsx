/* eslint-disable max-len */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as todosService from './api/todos';
import { Todo } from './types/Todo';
import classNames from 'classnames';
import { Header } from './components/Header';
import { TodoItem } from './components/TodoItem';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const [creatNewTodos, setCreateNewTodos] = useState('');
  const [todoItem, setTodoItem] = useState<Todo[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [todosItem, getTodosItem] = useState<Todo[]>([]);
  const [errorState, setStateError] = useState('');
  const userId = todosService.USER_ID;
  const [controlChecked, setControlChecked] = useState<number[]>([]);
  const [filter, setFilter] = useState('');
  const [disabledInput, setDisabledInput] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodo, setLoadingTodo] = useState<number | null>(null);
  const [loadingNewItem, setLoadingNewItem] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [deleteIds, setDeleteIds] = useState<number[]>([]);

  useEffect(() => {
    todosService
      .getTodos()
      .then(setTodoItem)
      .catch(() => setStateError('Your error message'));
  }, []);

  const getFilteredTodos = () => {
    if (filter === 'active') {
      return todoItem.filter(todo => !todo.completed);
    }

    if (filter === 'completed') {
      return todoItem.filter(todo => todo.completed);
    }

    return todoItem;
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const filteredTodos = getFilteredTodos();

  const handleForm = (event: React.FormEvent) => {
    setDisabledInput(true);
    event.preventDefault();

    if (creatNewTodos.trim() === '') {
      return;
    }

    const newTodo: Omit<Todo, 'id'> = {
      userId,
      title: creatNewTodos,
      completed: false,
    };

    // Додаємо тимчасовий todo в кінець списку
    const tempTodoItem = { ...newTodo, id: Date.now() };

    setTempTodo(tempTodoItem);
    setTodoItem(prev => [...prev, tempTodoItem]);

    setLoadingTodo(Date.now());
    setLoadingNewItem(true);

    todosService
      .createPost(newTodo)
      .then(createdTodo => {
        setTodoItem(prev =>
          prev.map(todo => (todo.id === tempTodoItem.id ? createdTodo : todo)),
        );
        setTempTodo(null); // Очищаємо tempTodo після успішного додавання
        setCreateNewTodos('');
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      })
      .catch(() => {
        setStateError('Unable to add a todo');
      })
      .finally(() => {
        setDisabledInput(false);
        setLoadingNewItem(false);
      });
  };

  const forClearCompleted = () => {
    const completedTodo = todoItem.filter(todo => todo.completed);
    const completedIds = completedTodo.map(todo => todo.id);

    setTodoItem(prev => prev.filter(todo => !completedIds.includes(todo.id)));
  };

  function errorGetTodos() {
    setStateError('');

    if (creatNewTodos.trim() === '') {
      setStateError('Title should not be empty');
      setTimeout(() => {
        setStateError('');
      }, 3000);

      return;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleTodoDelete = (usersId: number) => {
    setDeleteIds(prevIds => [...prevIds, usersId]);
    todosService
      .deleteTodos(usersId)
      .then(() => {
        setTodoItem(prevTodos => prevTodos.filter(todo => todo.id !== usersId));
      })
      .catch(() => {
        setStateError('Unable to delete a todo ');
        setTimeout(() => setStateError(''), 3000);
      });
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const updatedPost = (updatedPosts: Todo) => {
    todosService
      .updatePost(updatedPosts)
      .then(post => {
        setTodoItem(currentPost => {
          const newPost = [...currentPost];
          const index = newPost.findIndex(item => item.id === updatedPosts.id);

          newPost.splice(index, 1, post);

          return newPost;
        });
      })
      .catch(() => {
        setStateError('Unable to update a todo');
        setTimeout(() => setStateError(''), 3000);
      });
  };

  const activeTodosCount = useMemo(() => {
    return todoItem.filter(todo => !todo.completed).length;
  }, [todoItem]);

  if (!todosService.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          handleForm={handleForm}
          errorGetTodos={errorGetTodos}
          setCreateNewTodos={setCreateNewTodos}
          disabledInput={disabledInput}
          createNewTodos={creatNewTodos}
          inputRef={inputRef}
        />

        <section className="todoapp__main" data-cy="TodoList">
          <TodoList
            todos={todosItem}
            tempTodo={tempTodo}
            controlChecked={controlChecked}
            setControlChecked={setControlChecked}
            setTodoItem={setTodoItem}
            handleTodoDelete={handleTodoDelete}
          />

          <TodoItem
            todoItem={todoItem}
            controlChecked={controlChecked}
            setControlChecked={setControlChecked}
            setTodoItem={setTodoItem}
            handleTodoDelete={handleTodoDelete}
            loadingTodo={loadingTodo}
            loadingNewItem={loadingNewItem}
          />
        </section>

        <Footer
          todoItem={todoItem}
          filter={filter}
          setFilter={setFilter}
          forClearCompleted={forClearCompleted}
          activeTodosCount={activeTodosCount}
        />
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames('', {
          'notification is-danger is-light has-text-weight-normal': errorState,
        })}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className={classNames('', {
            // eslint-disable-next-line prettier/prettier
            'delete hidden': errorState,
          })}
          onClick={() => setStateError('')}
        />
        {errorState}
      </div>
    </div>
  );
};
