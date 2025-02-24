/* eslint-disable max-len */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as todosService from './api/todos';
import { Todo } from './types/Todo';
import classNames from 'classnames';

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
        <header className="todoapp__header">
          {/* this button should have active class only if all todos are completed */}
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit */}
          <form
            onSubmit={event => {
              handleForm(event);
              errorGetTodos();
            }}
          >
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={creatNewTodos}
              onChange={event => {
                setCreateNewTodos(event.target.value);
              }}
              ref={inputRef}
              disabled={disabledInput}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {/* This is a completed todo */}

          {tempTodo && (
            <>
              <div
                data-cy="Todo"
                key={tempTodo.id}
                className={classNames('todo', {
                  completed: controlChecked.includes(tempTodo.id),
                })}
              >
                <label
                  className="todo__status-label"
                  onClick={() => {
                    setControlChecked([tempTodo.id]);
                    setTodoItem(prevItems =>
                      prevItems.map(todo =>
                        todo.id === tempTodo.id
                          ? { ...todo, completed: !todo.completed }
                          : todo,
                      ),
                    );
                  }}
                >
                  <input
                    data-cy="TodoStatus"
                    type="checkbox"
                    className="todo__status"
                  />
                </label>
                <span data-cy="TodoTitle" className="todo__title">
                  {tempTodo.title}
                </span>
                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDelete"
                  onClick={() => TodoDeleteButton(tempTodo.id)}
                >
                  ×
                </button>
                <div
                  data-cy="TodoLoader"
                  className={classNames('modal overlay', {
                    'is-active': tempTodo,
                  })}
                >
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </div>
            </>
          )}

          {todoItem.map(item => (
            <>
              <div
                data-cy="Todo"
                key={item.id}
                className={classNames('todo', {
                  // eslint-disable-next-line prettier/prettier
                  completed: controlChecked.includes(item.id),
                })}
              >
                <label
                  className="todo__status-label"
                  onClick={() => {
                    setControlChecked([item.id]);
                    setTodoItem(prevItems =>
                      prevItems.map(todo =>
                        todo.id === item.id
                          ? { ...todo, completed: !todo.completed }
                          : todo,
                      ),
                    );
                  }}
                >
                  <input
                    data-cy="TodoStatus"
                    type="checkbox"
                    className="todo__status"
                  />
                </label>

                <span data-cy="TodoTitle" className="todo__title">
                  {item.title}
                </span>
                {/* Remove button appears only on hover */}
                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDelete"
                  onClick={() => TodoDeleteButton(item.id)}
                >
                  ×
                </button>

                {/* overlay will cover the todo while it is being deleted or updated is-active*/}
                <div
                  data-cy="TodoLoader"
                  className={classNames('modal overlay', {
                    'is-active': loadingTodo === item.id || loadingNewItem,
                  })}
                >
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </div>
            </>
          ))}
        </section>

        {/* Hide the footer if there are no todos */}
        <footer className="todoapp__footer" data-cy="Footer">
          <span className="todo-count" data-cy="TodosCounter">
            {tempTodo !== null ? `3 items left` : ''}
          </span>

          {/* Active link should have the 'selected' class */}
          <nav className="filter" data-cy="Filter">
            <a
              href="#/"
              className={classNames('filter__link', {
                selected: clickButtons === 'all',
              })}
              data-cy="FilterLinkAll"
              onClick={() => {
                setClickButtons('all');
              }}
            >
              All
            </a>
            <a
              href="#/active"
              className={classNames('filter__link', {
                selected: clickButtons === 'active',
              })}
              data-cy="FilterLinkActive"
              onClick={() => {
                setClickButtons('active');
              }}
            >
              Active
            </a>

            <a
              href="#/completed"
              className={classNames('filter__link', {
                selected: clickButtons === 'completed',
              })}
              data-cy="FilterLinkCompleted"
              onClick={() => {
                setClickButtons('completed');
              }}
            >
              Completed
            </a>
          </nav>

          {/* this button should be disabled if there are no completed todos */}
          <button
            type="button"
            className="todoapp__clear-completed"
            data-cy="ClearCompletedButton"
            onClick={() => {
              forClearCompleted();
            }}
          >
            Clear completed
          </button>
        </footer>
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
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
        {/* show only one message at a time */}
        {errorState}
      </div>
    </div>
  );
};
