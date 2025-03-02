import React from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

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
  return (
    <footer
      style={{ display: todoItem.length ? '' : 'none' }}
      className="todoapp__footer"
      data-cy="Footer"
    >
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount > 0
          ? `${activeTodosCount} items left`
          : 'No items left'}
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filter === 'all',
          })}
          data-cy="FilterLinkAll"
          onClick={() => {
            setFilter('');
          }}
        >
          All
        </a>
        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filter === 'active',
          })}
          data-cy="FilterLinkActive"
          onClick={() => {
            setFilter('active');
          }}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filter === 'completed',
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => {
            setFilter('completed');
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
  );
};
