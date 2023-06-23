import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './NotFound.module.css';
import { Lines } from './Lines';
import { Numbers404 } from './Numbers404';

export function NotFound() {
	const nums = useRef(null);
	const one = useRef(null);
	const two = useRef(null);
	const three = useRef(null);
	const four = useRef(null);
	const five = useRef(null);
	const six = useRef(null);

	useEffect(() => {
		nums.current.classList.add(`${styles.onShowNums}`);
		one.current.classList.add(`${styles.onShowOne}`);
		two.current.classList.add(`${styles.onShowTwo}`);
		three.current.classList.add(`${styles.onShowThree}`);
		four.current.classList.add(`${styles.onShowFour}`);
		five.current.classList.add(`${styles.onShowFive}`);
		six.current.classList.add(`${styles.onShowSix}`);
	}, []);

	return (
		<div className={styles.notFound}>
			<div className={styles.wrapper}>
				<Lines />

				<div className={styles.dialog}>
					<div className={styles.itemLeft} ref={one} key="one">
						Ошибка 404, страница не найдена 😔
					</div>
					<div className={styles.itemRight} ref={two} key="two">
						И что же мне делать? 😮
					</div>
					<div className={styles.itemLeft} ref={three} key="three">
						Возвращайся на Главную! 💃
					</div>
					<div className={styles.itemRight} ref={four} key="four">
						А как это сделать? 🤔
					</div>
					<div className={styles.itemLeft} ref={five} key="five">
						Нажать на большую жёлтую кнопку 🚀
					</div>
					<div className={styles.itemRight} ref={six} key="six">
						Так бы сразу и сказали! 😅
					</div>
				</div>

				<Numbers404 ref={nums} />

				<Link to="/" className={styles.link}>
					Большая жёлтая кнопка
				</Link>
			</div>
		</div>
	);
}
