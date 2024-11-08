// Todos.tsx
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../app/store";
import { removeTodo } from "../../feature/todo/todoSlice";

const Todos: React.FC = () => {

    const todos = useSelector((state: RootState) => state.todo.todos);
    const dispatch: AppDispatch = useDispatch();

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100 py-6 px-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Your Todos</h2>

                {todos.length === 0 ? (
                    <p className="text-center text-gray-500">No todos available. Add some!</p>
                ) : (
                    <ul className="space-y-3">
                        {todos.map((todo) => (
                            <li
                                key={todo.id}
                                className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm"
                            >
                                <span className="text-gray-700">{todo.text}</span>
                                <button
                                    onClick={() => dispatch(removeTodo(todo.id))}
                                    className="text-red-500 hover:text-red-600 font-semibold"
                                >
                                    X
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Todos;
