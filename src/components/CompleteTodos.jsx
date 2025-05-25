import React from "react";

export const CompleteTodos = (props) => {
  const { todos, onClickBack } = props;
  return (
    <div className="complete-area">
      <p className="title">完了したTODO</p>
      <ul>
        {todos.map((todo) => { // todoがオブジェクトになる
          return (
            <li key={todo.id}> {/* keyをtodo.idに変更 */}
              <div className="list-row">
                <p className="todo-item">{todo.content}</p> {/* todo.contentを表示 */}
                <button onClick={() => onClickBack(todo)}>戻す</button> {/* todoオブジェクトを渡す */}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};