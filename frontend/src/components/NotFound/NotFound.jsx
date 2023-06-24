import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './NotFound.module.css';
import { Lines } from './Lines';
import { Numbers404 } from './Numbers404';
import { Dialog } from './Dialog';

export function NotFound() {
	const nums = useRef(null);
	const oneMessage = useRef(null);
	const twoMessage = useRef(null);
	const threeMessage = useRef(null);
	const fourMessage = useRef(null);
	const fiveMessage = useRef(null);
	const sixMessage = useRef(null);

	const messages = [
		{
			id: 'oneMessage',
			ref: oneMessage,
			message: 'Ошибка 404, страница не найдена 😔',
			isLeft: true,
		},
		{
			id: 'twoMessage',
			ref: twoMessage,
			message: 'И что же мне делать? 😮',
			isLeft: false,
		},
		{
			id: 'threeMessage',
			ref: threeMessage,
			message: 'Возвращайся на Главную! 💃',
			isLeft: true,
		},
		{
			id: 'fourMessage',
			ref: fourMessage,
			message: 'А как это сделать? 🤔',
			isLeft: false,
		},
		{
			id: 'fiveMessage',
			ref: fiveMessage,
			message: 'Нажать на большую жёлтую кнопку 🚀',
			isLeft: true,
		},
		{
			id: 'sixMessage',
			ref: sixMessage,
			message: 'Так бы сразу и сказали! 😅',
			isLeft: false,
		},
	];

	useEffect(() => {
		nums.current.classList.add(`${styles.onShowNums}`);
		oneMessage.current.classList.add(`${styles.onShowOne}`);
		twoMessage.current.classList.add(`${styles.onShowTwo}`);
		threeMessage.current.classList.add(`${styles.onShowThree}`);
		fourMessage.current.classList.add(`${styles.onShowFour}`);
		fiveMessage.current.classList.add(`${styles.onShowFive}`);
		sixMessage.current.classList.add(`${styles.onShowSix}`);
	}, []);

	return (
		<div className={styles.notFound}>
			<div className={styles.wrapper}>
				<Lines />
				<Dialog messages={messages} />
				<Numbers404 ref={nums} />
				<Link to="/" className={styles.link}>
					Большая жёлтая кнопка
				</Link>
			</div>
		</div>
	);
}
