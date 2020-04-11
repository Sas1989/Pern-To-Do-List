import React, {Fragment,useEffect,useState} from "react";

import EditTodo from "./EditTodo";

const ListTodos = () => {
    const [todos, setTodos] = useState([]);

    //delete function
    const deleteTodo = async(id) => {
        try {
            const deleteTodo = await fetch(`http://localhost:5000/todos/${id}`,{
              method:"DELETE"  
            });
            setTodos(todos.filter(todo => todo.todo_id !== id));
        } catch (error) {
            console.error(error.messagge)
        }
    }

    const getTodos = async() => {
        try {
            const response = await fetch("http://localhost:5000/todos");
            const jsonData = await response.json();
            setTodos(jsonData);
        } catch (error) {
            console.error(error.messagge)
        }
    }

    useEffect(()=> {getTodos();},[]);
    return <Fragment>
        <table className="table mt-5 text-center ">
    <tbody>
        {todos.map(todo =>(
        <tr key={todo.todo_id}>
            <td scope="row"><i style={{color:"blue"}} class="far fa-circle"></i></td>
            <td align="left" className="col-md-10">{todo.description}</td>
            <td className="col-md-1"><EditTodo todo={todo}/></td>
            <td className="col-md-1"><i style={{color:"red"}} className="far fa-trash-alt" onClick={()=> deleteTodo(todo.todo_id)}></i></td>
        </tr>
        ))}
    </tbody>
  </table>
    </Fragment>;
};

export default ListTodos;