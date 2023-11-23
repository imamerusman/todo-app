import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import api from '../src/config';
import {
  Container,
  Typography,
  Button,
  Icon,
  Paper,
  Box,
  TextField,
  Checkbox,
  Link
} from "@material-ui/core";

const useStyles = makeStyles({
  addTodoContainer: { padding: 10 },
  addTodoButton: { marginLeft: 5 },
  todosContainer: { marginTop: 10, padding: 10 },
  todoContainer: {
    borderTop: "1px solid #bfbfbf",
    marginTop: 5,
    "&:first-child": {
      margin: 0,
      borderTop: "none",
    },
    "&:hover": {
      "& $deleteTodo": {
        visibility: "visible",
      },
    },
  },
  todoTextCompleted: {
    textDecoration: "line-through",
  },
  deleteTodo: {
    visibility: "hidden",
  },
  filterByToday: {
    width: "78%",
    display: "inline-block",
    cursor: "pointer",
    paddingRight: 10,
    opacity: 0
  },
  resetBtn: {
    cursor: "pointer",
    textDecoration: "underline",
  }
});

function Todos() {
  const classes = useStyles();
  const [todos, setTodos] = useState([]);
  const [newTodoText, setNewTodoText] = useState("");
  const [newTodoDueDate, setNewTodoDueDate] = useState("");
  const [clicked, setClickedOnce] = useState(false)

  useEffect(() => {
    getTodos();
  }, [setTodos]);

  // remove all
  function removeAll() {
    fetch(api.baseURL + 'all', {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({}),
    }).then((response) => {
      return getTodos()
    })
  }

  //Get Tasks
  function getTodos(filter="") {
    const query = (filter) ? "?filter=" + filter : "";
    fetch(api.baseURL)
      .then((response) => response.json())
      .then((todos) => setTodos(todos));

      setClickedOnce(false);
      setNewTodoText("");
      setNewTodoDueDate("");
  }

  //Create a task
  function addTodo(text, dueDate) {
    if (text.trim().length === 0 || dueDate.toString().trim().length === 0) {
      setClickedOnce(true)
      return;
    }
    fetch(api.baseURL, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ text, due_date: dueDate }),
    })
      .then((response) => response.json())
      .then((todo) => setTodos([...todos, todo]));
    setClickedOnce(false);
    setNewTodoText("");
    setNewTodoDueDate("");
  }

  //Mark task as complete
  function toggleTodoCompleted(id) {
    fetch(api.baseURL + id, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify({
        completed: !todos.find((todo) => todo.id === id).completed,
      }),
    }).then(() => {
      const newTodos = [...todos];
      const modifiedTodoIndex = newTodos.findIndex((todo) => todo.id === id);
      newTodos[modifiedTodoIndex] = {
        ...newTodos[modifiedTodoIndex],
        completed: !newTodos[modifiedTodoIndex].completed,
      };
      setTodos(newTodos);
    });
  }

  //Delete a Task
  function deleteTodo(id) {
    fetch(api.baseURL + id, {
      method: "DELETE",
    }).then(() => setTodos(todos.filter((todo) => todo.id !== id)));
  }

  //Filter tasks by today
  function filterByToday() {
    let today = new Date(),
    day = today.getDate(),
    month = (today.getMonth() + 1).toString().padStart(2, "0"),
    year = today.getFullYear();
    getTodos(year+"-"+month+"-"+day);
  }

  //Format date to show in the UI
  function changeDateFormat(date) {
    if (!date) {
      return;
    }
    let updatedDate = new Date(date);
    return updatedDate.toDateString();
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h3" gutterBottom display="inline">
        Todos
      </Typography>
      <Typography
      variant="body1"
      align="right"
      className={classes.filterByToday}
      onClick={() => filterByToday()}>
        Filter By: Due Today
      </Typography>
      <Link
      variant="body1"
      align="right"
      className={classes.resetBtn}
      onClick={() => removeAll()}>
        Clear All
      </Link>
      <Paper className={classes.addTodoContainer}>
        <Box display="flex" flexDirection="row">
          <Box flexGrow={1}>
            <TextField
              error={clicked && newTodoText.trim().length < 1}
              style={{width:'68%', marginRight: '5px' }}
              label="Title"
              type="text"
              value={newTodoText}
              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  addTodo(newTodoText, newTodoDueDate);
                }
              }}
              onChange={(event) => setNewTodoText(event.target.value)}
              name="task"
            />
            <TextField
              error={clicked && newTodoDueDate.toString().trim().length < 1}
              style={{width:'25%'}}
              label="Due Date"
              type="date"
              value={newTodoDueDate}
              onChange={(event) => setNewTodoDueDate(event.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>
          <Button
            className={classes.addTodoButton}
            startIcon={<Icon>add</Icon>}
            onClick={() => addTodo(newTodoText, newTodoDueDate)}
            name="add"
          >
            Add
          </Button>
        </Box>
      </Paper>
      {todos.length > 0 && (
        <Paper className={classes.todosContainer}>
          <Box display="flex" flexDirection="column" alignItems="stretch">
            {todos.map(({ id, text, completed, due_date }) => (
              <Box
                key={id}
                display="flex"
                flexDirection="row"
                alignItems="center"
                className={classes.todoContainer}
              >
                <Checkbox
                  checked={completed}
                  onChange={() => toggleTodoCompleted(id)}
                ></Checkbox>
                <Box flexGrow={1}>
                  <Typography
                    className={completed ? classes.todoTextCompleted : ""}
                    variant="body1"
                  >
                    {text}
                  </Typography>
                  { changeDateFormat(due_date) && <Typography variant="caption"> Due Date: {changeDateFormat(due_date)}</Typography>}
                </Box>
                <Button
                  className={classes.deleteTodo}
                  startIcon={<Icon>delete</Icon>}
                  onClick={() => deleteTodo(id)}
                >
                  Delete
                </Button>
              </Box>
            ))}
          </Box>
        </Paper>
      )}
    </Container>
  );
}

export default Todos;
