import { useState, useEffect, useCallback, useRef } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [inputValue, setInputValue] = useState("");
  const [tasks, setTasks] = useState([]);
  const [taskId, setTaskId] = useState(null);
  const ref = useRef(null);

  async function showData() {
    const response = await axios.get(
      "https://api-vanilla.onrender.com/api/tasks"
    );
    setTasks(response.data);
  }

  const handleSubmit = useCallback(
    async (e, inputValue) => {
      e.preventDefault();
      if (taskId) {
        await axios.put(
          `https://api-vanilla.onrender.com/api/tasks/${taskId}`,
          {
            task: inputValue,
          }
        );

        setTaskId(null);
      } else {
        await axios.post("https://api-vanilla.onrender.com/api/tasks/create", {
          task: inputValue,
        });
      }

      showData();
      setInputValue("");
    },
    [taskId]
  );

  const deleteTodo = useCallback(async (id) => {
    await axios.delete(`https://api-vanilla.onrender.com/api/tasks/${id}`);
    showData();
  }, []);

  const checkboxChecker = useCallback(async (e, id) => {
    const checked = e.target.checked;
    await axios.put(`https://api-vanilla.onrender.com/api/tasks/${id}`, {
      completed: checked,
    });

    setTasks((prevTasks) => {
      return prevTasks.map((task) => {
        if (task._id === id) {
          return { ...task, completed: checked };
        }
        return task;
      });
    });
  }, []);

  const setEditableId = (id, task) => {
    setTaskId(id);
    setInputValue(task);
    ref.current.focus();
  };

  useEffect(() => {
    showData();
  }, []);

  useEffect(() => {
    console.log(taskId);
  }, [taskId]);

  return (
    <>
      <form onSubmit={(e) => handleSubmit(e, inputValue)}>
        <div className="header">
          <input
            type="text"
            onChange={(e) => setInputValue(e.target.value)}
            value={inputValue}
            ref={ref}
          />
        </div>
      </form>
      <ul>
        {tasks.map((item) => {
          return (
            <div key={item._id}>
              <li className={item.completed ? "completed" : ""}>{item.task}</li>
              <i
                className="fa-solid fa-trash"
                onClick={() => deleteTodo(item._id)}
              ></i>
              <i
                className="fa-regular fa-pen-to-square"
                onClick={() => setEditableId(item._id, item.task)}
              ></i>
              <input
                type="checkbox"
                checked={item.completed}
                onChange={(e) => checkboxChecker(e, item._id)}
              />
            </div>
          );
        })}
      </ul>
      <p>You got {tasks.length} tasks</p>
    </>
  );
}

export default App;
