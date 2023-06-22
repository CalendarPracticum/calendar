import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styles from './NotFound.module.css';

export function NotFound({ setIsLoading }) {
	setIsLoading(false);

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
				<div className={styles.lines}>
					<div className={styles.line} />
					<div className={styles.line} />
					<div className={styles.line} />
					<div className={`${styles.line} ${styles.fourthLine}`}>
						<div className={styles.hook} />
					</div>
					<div className={styles.line} />
					<div className={styles.line} />
					<div className={styles.line} />
				</div>
				<div className={styles.dialog}>
					<div className={styles.itemLeft} ref={one} key="one">
						`Ошибка 404, страница не найдена 😔`
					</div>
					<div className={styles.itemRight} ref={two} key="two">
						`И что же мне делать? 😮`
					</div>
					<div className={styles.itemLeft} ref={three} key="three">
						`Возвращайся на Главную! 💃`
					</div>
					<div className={styles.itemRight} ref={four} key="four">
						`А как это сделать? 🤔`
					</div>
					<div className={styles.itemLeft} ref={five} key="five">
						`Нажать на большую жёлтую кнопку 🚀`
					</div>
					<div className={styles.itemRight} ref={six} key="six">
						`Так бы сразу и сказали! 😅`
					</div>
				</div>

				<div className={styles.nums} ref={nums}>
					<div className={styles.numFourStart} />
					<div className={styles.numZero} />
					<div className={styles.numFourEnd} />
				</div>

				<Link to="/" className={styles.link}>
					Большая жёлтая кнопка
				</Link>
			</div>
		</div>
	);
}

NotFound.propTypes = {
	setIsLoading: PropTypes.func.isRequired,
};
