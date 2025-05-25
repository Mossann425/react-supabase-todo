import React, { useState, useEffect } from "react"; // useEffectを追加
import { CompleteTodos } from "./components/CompleteTodos";
import { IncompleteTodos } from "./components/IncompleteTodos";
import { InputTodo } from "./components/InputTodo";
import "./styles.css";

// Supabaseクライアントをインポート
import { supabase } from "src/supabase"; // あなたのsupabase.jsのパスに合わせてください

export const Todo = () => {
  const [todoText, setTodoText] = useState("");
  // Supabaseに保存されるデータ構造に合わせてオブジェクトの配列にする
  const [incompleteTodos, setIncompleteTodos] = useState([]);
  const [completeTodos, setCompleteTodos] = useState([]);
  const [loading, setLoading] = useState(true); // ロード状態の管理

  // --- 初期データの読み込み ---
  useEffect(() => {
    const fetchTodos = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('todos') // Supabaseのテーブル名。例: 'todos'
        .select('*')
        .order('id', { ascending: true }); // IDでソート（任意）

      if (error) {
        console.error("Error fetching todos:", error);
      } else {
        const fetchedIncomplete = data.filter(todo => !todo.is_complete);
        const fetchedComplete = data.filter(todo => todo.is_complete);
        setIncompleteTodos(fetchedIncomplete);
        setCompleteTodos(fetchedComplete);
      }
      setLoading(false);
    };

    fetchTodos();
  }, []); // コンポーネントがマウントされたときに一度だけ実行

  // --- 入力処理 ---
  const onChangeTodoText = (event) => setTodoText(event.target.value);

  // --- TODO追加処理 ---
  const onClickAdd = async () => {
    if (todoText === "") return;

    // Supabaseに新しいTODOを挿入
    const { data, error } = await supabase
      .from('todos')
      .insert([
        { content: todoText, is_complete: false } // Supabaseのテーブル構造に合わせてください
      ])
      .select(); // 挿入されたデータを返す

    if (error) {
      console.error("Error adding todo:", error);
    } else if (data && data.length > 0) {
      // 成功したらローカルの状態も更新
      setIncompleteTodos([...incompleteTodos, data[0]]); // Supabaseから返されたID付きのTodoを追加
      setTodoText("");
    }
  };

  // --- TODO削除処理 ---
  const onClickDelete = async (idToDelete) => { // idを引数として受け取る
    // SupabaseからTODOを削除
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', idToDelete); // idが一致するレコードを削除

    if (error) {
      console.error("Error deleting todo:", error);
    } else {
      // 成功したらローカルの状態も更新
      const newTodos = incompleteTodos.filter(todo => todo.id !== idToDelete);
      setIncompleteTodos(newTodos);
    }
  };

  // --- TODO完了処理 ---
  const onClickComplete = async (todoToComplete) => { // オブジェクト全体を受け取る
    // SupabaseでTODOの状態を更新
    const { data, error } = await supabase
      .from('todos')
      .update({ is_complete: true })
      .eq('id', todoToComplete.id) // idが一致するレコードを更新
      .select();

    if (error) {
      console.error("Error completing todo:", error);
    } else if (data && data.length > 0) {
      // 成功したらローカルの状態も更新
      const newIncompleteTodos = incompleteTodos.filter(
        (todo) => todo.id !== todoToComplete.id
      );
      setIncompleteTodos(newIncompleteTodos);
      setCompleteTodos([...completeTodos, data[0]]);
    }
  };

  // --- TODOを未完了に戻す処理 ---
  const onClickBack = async (todoToBack) => { // オブジェクト全体を受け取る
    // SupabaseでTODOの状態を更新
    const { data, error } = await supabase
      .from('todos')
      .update({ is_complete: false })
      .eq('id', todoToBack.id) // idが一致するレコードを更新
      .select();

    if (error) {
      console.error("Error reverting todo:", error);
    } else if (data && data.length > 0) {
      // 成功したらローカルの状態も更新
      const newCompleteTodos = completeTodos.filter(
        (todo) => todo.id !== todoToBack.id
      );
      setCompleteTodos(newCompleteTodos);
      setIncompleteTodos([...incompleteTodos, data[0]]);
    }
  };

  const isMaxLimitIncompleteTodos = incompleteTodos.length >= 5;

  if (loading) {
    return <p>Loading todos...</p>;
  }

  return (
    <>
      <InputTodo
        todoText={todoText}
        onChange={onChangeTodoText}
        onClick={onClickAdd}
        disabled={isMaxLimitIncompleteTodos}
      />
      {isMaxLimitIncompleteTodos && (
        <p style={{ color: "red" }}>
          登録できるTODOは5個までだよ〜。消化しろ〜。
        </p>
      )}
      <IncompleteTodos
        todos={incompleteTodos}
        onClickComplete={onClickComplete}
        onClickDelete={onClickDelete}
      />
      <CompleteTodos todos={completeTodos} onClickBack={onClickBack} />
    </>
  );
};