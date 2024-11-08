import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addTodo } from "../../feature/todo/todoSlice";
const AddTodo: React.FC = ()=>{
    const [input, setInput]= useState<string>('');
    const dispatch= useDispatch();

    const addTodoHandler= (e:React.FormEvent) => {
        e.preventDefault();
        if(input.trim()){
            dispatch(addTodo(input));
            setInput('');
        }
       
    }
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Add a New Todo</h2>
            
            <div className="flex items-center space-x-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter a todo..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={addTodoHandler}
                    className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none"
                >
                    Add
                </button>
            </div>
        </div>
    </div>
    )
};

export default AddTodo;