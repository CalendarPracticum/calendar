/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';
import styles from './NotFound.module.css';

const ItemLeft = ({ text, icon }) => (
	<div className={styles.itemLeft}>{`${text} ${icon}`}</div>
);

const ItemRight = ({ text, icon }) => (
	<div className={styles.itemRight}>{`${text} ${icon}`}</div>
);

const dialogData = [
	{
		text: 'Ошибка 404, страница не найдена',
		icon: '😔',
		isLeft: true,
	},
	{
		text: 'И что же мне делать?',
		icon: '😮',
		isLeft: false,
	},
	{
		text: 'Возвращайся на Главную!',
		icon: '💃',
		isLeft: true,
	},
	{
		text: 'А как это сделать?',
		icon: '🤔',
		isLeft: false,
	},
	{
		text: 'Нажать на большую жёлтую кнопку',
		icon: '🚀',
		isLeft: true,
	},
	{
		text: 'Так бы сразу и сказали!',
		icon: '😅',
		isLeft: false,
	},
];

export function NotFound() {
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
					{dialogData.map(({ text, icon, isLeft }) =>
						isLeft ? (
							<ItemLeft text={text} icon={icon} key={text} />
						) : (
							<ItemRight text={text} icon={icon} key={text} />
						)
					)}
				</div>
				<div className={styles.nums}>
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
