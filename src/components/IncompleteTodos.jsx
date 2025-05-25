import React from "react";

export const IncompleteTodos = (props) => {
  const { todos, onClickComplete, onClickDelete } = props;
  return (
    <div className="incomplete-area">
      <p className="title">未完了のTODO</p>
      <ul>
        {todos.map((todo) => { // todoがオブジェクトになる
          return (
            <li key={todo.id}> {/* keyをtodo.idに変更 */}
              <div className="list-row">
                <p className="todo-item">{todo.content}</p> {/* todo.contentを表示 */}
                <button onClick={() => onClickComplete(todo)}>完了</button> {/* todoオブジェクトを渡す */}
                <button onClick={() => onClickDelete(todo.id)}>削除</button> {/* todo.idを渡す */}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};