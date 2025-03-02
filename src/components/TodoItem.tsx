import React, { Dispatch, SetStateAction } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';
import { TodoLoader } from './TodoLoader';

interface TodoIt {
  tempTodo: Todo;
  controlChecked: number[];
  setControlChecked: Dispatch<SetStateAction<number[]>>;
  setTodoItem: Dispatch<SetStateAction<Todo[]>>;
  handleTodoDelete: (usersId: number) => void;
  arrTodos: number[];
  delLoader: number | null;
}

export const TodoItem: React.FC<TodoIt> = ({
  tempTodo,
  controlChecked,
  setControlChecked,
  setTodoItem,
  handleTodoDelete,
  arrTodos,
}) => {
  const toggleTodo = (id: number) => {
    setControlChecked(prev =>
      prev.includes(id) ? prev.filter(todoId => todoId !== id) : [...prev, id],
    );

    setTodoItem(prevItems =>
      prevItems.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  return (
    <div
      data-cy="Todo"
      key={tempTodo.id}
      className={classNames('todo', {
        completed: controlChecked.includes(tempTodo.id),
      })}
    >
      <label
        className="todo__status-label"
        aria-label="Name"
        onClick={() => toggleTodo(tempTodo.id)}
      >
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={controlChecked.includes(tempTodo.id)}
          readOnly
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {tempTodo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleTodoDelete(tempTodo.id)}
      >
        ×
      </button>

      <TodoLoader isActive={arrTodos.includes(tempTodo.id)} />
    </div>
  );
};
