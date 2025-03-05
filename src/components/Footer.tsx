import React from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';
import { TodoFilter } from '../types/FilterEnum';

interface InterfaceFooter {
  todoItem: Todo[];
  filter: string;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
  forClearCompleted: () => void;
  activeTodosCount: number;
}

export const Footer: React.FC<InterfaceFooter> = ({
  todoItem,
  filter,
  setFilter,
  forClearCompleted,
  activeTodosCount,
}) => {
  const filters = Object.entries(TodoFilter).map(([key, value]) => ({
    label: key.charAt(0).toUpperCase() + key.slice(1).toLowerCase(),
    value,
  }));

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodosCount} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {filters.map(({ label, value }) => (
          <a
            key={value}
            href={`#/${value}`}
            className={classNames('filter__link', {
              selected: filter === value,
            })}
            data-cy={`FilterLink${label}`}
            onClick={() => setFilter(value)}
          >
            {label}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={forClearCompleted}
        disabled={todoItem.every(todo => !todo.completed)}
      >
        Clear completed
      </button>
    </footer>
  );
};
