import React from "react";
import AddTodo from "./AddTodo";
import Todos from "./Todos";
const TodoHome:React.FC= () => {

    return (
        <div>
           <AddTodo />
           <Todos />
        </div>
    )
}

export default TodoHome;