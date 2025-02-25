/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { Dispatch, SetStateAction } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

interface List {
  tempTodo: Todo | null;
  controlChecked: number[];
  setControlChecked: Dispatch<SetStateAction<number[]>>;
  setTodoItem: Dispatch<SetStateAction<Todo[]>>;
  TodoDeleteButton: (usersId: number) => void;
}

export const TodoList: React.FC<List> = ({
  tempTodo,
  controlChecked,
  setControlChecked,
  setTodoItem,
  TodoDeleteButton,
}) => {
  return (
    <>
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
              onClick={() => {
                TodoDeleteButton(tempTodo.id);
              }}
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
    </>
  );
};
