/* eslint-disable max-len */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
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
  const [allTodos, getAllTodos] = useState<Todo[]>([]);
  const [errorState, setStateError] = useState('');
  const userId = todosService.USER_ID;
  const [controlChecked, setControlChecked] = useState<number[]>([]);
  const [clickButtons, setClickButtons] = useState('');
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

  useEffect(() => {
    let filterItems = [...todoItem];

    if (clickButtons === 'active') {
      filterItems = filterItems.filter(todo => !todo.completed);
    } else if (clickButtons === 'completed') {
      filterItems = filterItems.filter(todo => todo.completed);
    }

    setTodoItem(filterItems);
  }, [clickButtons]);

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function errorGetTodos() {
    setStateError('');

    if (creatNewTodos.trim() === '') {
      setStateError('Title should not be empty');
      setTimeout(() => {
        setStateError('');
      }, 3000);

      return;
    }

    setTimeout(() => {}, 3000);

    todosService
      .getTodos()
      .then(data => {
        getAllTodos(data);
      })
      .catch(error => {
        setStateError('Unable to load todos');
        throw error;
      });

    setTimeout(() => {}, 3000);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const TodoDeleteButton = (usersId: number) => {
    setDeleteIds(prevIds => [...prevIds, userId]);
    todosService
      .deleteTodos(usersId)
      .then(() => {
        todosService
          .getTodos()
          .then(updatedTodos => {
            setTodoItem(updatedTodos);
          })
          .catch(() => {
            setStateError('Unable updated todos');
            setTimeout(() => setStateError(''), 3000);
          });
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

  useEffect(() => {
    let filterItems = [...todoItem];

    if (clickButtons === 'active') {
      filterItems = filterItems.filter(todo => !todo.completed);
    } else if (clickButtons === 'completed') {
      filterItems = filterItems.filter(todo => todo.completed);
    } else if (clickButtons === 'clearCompleted') {
    }

    setTodoItem(filterItems);
  }, [clickButtons]);

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
            tempTodo={tempTodo}
            controlChecked={controlChecked}
            setControlChecked={setControlChecked}
            setTodoItem={setTodoItem}
            TodoDeleteButton={TodoDeleteButton}
          />

          <TodoItem
            todoItem={todoItem}
            controlChecked={controlChecked}
            setControlChecked={setControlChecked}
            setTodoItem={setTodoItem}
            TodoDeleteButton={TodoDeleteButton}
            loadingTodo={loadingTodo}
            loadingNewItem={loadingNewItem}
          />
        </section>

        <Footer
          todoItem={todoItem}
          tempTodo={tempTodo}
          clickButtons={clickButtons}
          setClickButtons={setClickButtons}
          forClearCompleted={forClearCompleted}
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
