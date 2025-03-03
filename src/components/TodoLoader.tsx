import classNames from 'classnames';

interface Loader {
  loadingTodoId: number | null;
  todoId: number;
}

export const TodoLoader: React.FC<Loader> = ({ loadingTodoId, todoId }) => {
  return (
    <div
      data-cy="TodoLoader"
      className={classNames('modal overlay', {
        'is-active': loadingTodoId === todoId,
      })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
