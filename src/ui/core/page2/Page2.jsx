import {
	useEffect,
	useState,
} from 'react';

import {
	withCommon
} from 'common/hocs';

import {
	Button
} from 'common/components';

import {
	DataStore,
	Logger,
} from 'common';

import {
	TodoApi
} from 'api';

import
	styles
from './Page2.module.css'

const Page2Component = (props) => {

	const displayValue = DataStore.get('valueFromPage1') || 'No value entered on page 1';

	const [todos, setTodos] = useState([]);

	const onBackClick = () => {
		props.navigate('/');
	};

	const load = () => {

		props.showLoader();

		TodoApi.getTodoList()
			.then(res => {

				if (!res.ok || !Array.isArray(res.data)) {
					
					Logger.error('Page2', 'load', res.message || 'Unable to load todo\'s');
					// show error toast
					return;
				}

				const todoElements = [];

				for (let i = 0; i < res.data.length; i++) {
					todoElements.push(<div key={i}>{res.data[i]}</div>);
				}

				setTodos(todoElements);
			})
			.catch(e => {

				Logger.error('Page2', 'load', e);
				// show error toast
			})
			.finally(() => {
				props.hideLoader();
			});
	};

	useEffect(load, []);

	return (
		<>

			{todos}

			<div
				className={styles.displayValue}>
					{displayValue}
			</div>

			<Button
				onClick={onBackClick}>
					Back to page 1
			</Button>

		</>
	);
};

export const Page2 = withCommon(Page2Component);