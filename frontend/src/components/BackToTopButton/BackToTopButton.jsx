import React, { useEffect, useState } from 'react';
import styles from './BackToTopButton.module.css';

export function BackToTopButton() {
	const [backToTopButton, setBackToTopButton] = useState(false);

	useEffect(() => {
		window.addEventListener('scroll', () => {
			if (window.scrollY > 100) {
				setBackToTopButton(true);
			} else {
				setBackToTopButton(false);
			}
		});
	}, []);

	const scrollUp = () => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		});
	};

	return (
		<div className={styles.buttonBox}>
			<button
				aria-label="Наверх"
				type="button"
				onClick={scrollUp}
				className={`
          w-2rem h-2rem border-round bg-primary pi pi-arrow-up text-base
          ${styles.button}
          ${backToTopButton ? styles.buttonOn : styles.buttonOff}
        `}
			/>
		</div>
	);
}
