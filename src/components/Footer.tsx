import React from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

interface InterfaceFooter {
  todoItem: Todo[];
  tempTodo: Todo | null;
  clickButtons: string;
  setClickButtons: React.Dispatch<React.SetStateAction<string>>;
  forClearCompleted: () => void;
}

export const Footer: React.FC<InterfaceFooter> = ({
  todoItem,
  tempTodo,
  clickButtons,
  setClickButtons,
  forClearCompleted,
}) => {
  return (
    <footer
      style={{ display: todoItem.length ? '' : 'none' }}
      className="todoapp__footer"
      data-cy="Footer"
    >
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
  );
};
