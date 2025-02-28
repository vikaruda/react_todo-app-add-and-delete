/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import React, { Dispatch, SetStateAction } from 'react';
import { Todo } from '../types/Todo';

interface TodoI {
  todoItem: Todo[];
  controlChecked: number[];
  setControlChecked: Dispatch<SetStateAction<number[]>>;
  setTodoItem: Dispatch<SetStateAction<Todo[]>>;
  handleTodoDelete: (usersId: number) => void;
  loadingTodo: number | null;
  loadingNewItem: boolean;
}

export const TodoItem: React.FC<TodoI> = ({
  todoItem,
  controlChecked,
  setControlChecked,
  setTodoItem,
  handleTodoDelete,
  loadingTodo,
  loadingNewItem,
}) => {
  return (
    <>
      {todoItem.map(item => (
        <div
          data-cy="Todo"
          key={item.id}
          className={classNames('todo', {
            completed: controlChecked.includes(item.id),
          })}
        >
          <label
            className="todo__status-label"
            onClick={() => {
              setControlChecked(prev =>
                prev.includes(item.id)
                  ? prev.filter(id => id !== item.id)
                  : [...prev, item.id],
              );

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
              checked={controlChecked.includes(item.id)}
              onChange={() => {}}
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {item.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleTodoDelete(item.id)}
          >
            ×
          </button>

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
      ))}
    </>
  );
};
