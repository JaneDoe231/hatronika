import {
	useEffect,
  useRef,
	useState,
} from 'react';

import {
	Button,
  TextInput
} from 'common/components';

import {
	withCommon
} from 'common/hocs';

import {
  TodoElement
} from 'ui/core/todoPage/components';

import {
	TodoApi
} from 'api';

const TodoPageComponent = (props) => {

  const [todos, setTodos] = useState([]);
  const newTodo = useRef('');

  const onInputChange = (val) => {
    newTodo.current = val;
  };

  const onAddTodoClick = () => {

    if (newTodo.current.trim() !== '') {
      setTodos([...todos, <TodoElement key={todos.length} text={newTodo.current} />]);
    }
  };

  const load = async () => {

    try {

      props.showLoader();

      const res = await TodoApi.getTodoList();

      if (!res.ok || !Array.isArray(res.data)) {
        
        Logger.error('TodoPage', 'load', res.message || 'Unable to load todo\'s');
        // show error toast
        return;
      }

      const todoElements = [];

      for (let i = 0; i < res.data.length; i++) {
        todoElements.push(<TodoElement key={i} text={res.data[i]} />);
      }

      setTodos(todoElements);
    }
    catch(e) {
      Logger.error('TodoPage', 'load', e);
      // show error toast
    }
    finally {
      props.hideLoader();
    }
	};

	useEffect(() => {

    load()
      .catch(e => Logger.error('TodoPage', 'useEffect.load', e));
  }, []);

  return (
    <div>
      <h1>Todo App</h1>

      <div>

        <label>Add Todo:</label>

        <TextInput 
          value={newTodo.current}
          onChange={onInputChange}
        />

        <Button onClick={onAddTodoClick}>Add</Button>

      </div>

      <div>
        {todos}
      </div>

    </div>
  );
};

export const TodoPage = withCommon(TodoPageComponent);
