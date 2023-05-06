import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { InputSwitch } from 'primereact/inputswitch';
import 'primeicons/primeicons.css';
import styles from './Header.module.css';

export function Header() {
	const [checked, setChecked] = useState(false);

	return (
		<div className={`${styles.header} container`}>
			<div>Logo</div>
			<div className={styles.togglerGroup}>
				<i className="pi pi-moon" style={{ fontSize: '1.5rem' }} />
				<InputSwitch checked={checked} onChange={(e) => setChecked(e.value)} />
				<i className="pi pi-sun" style={{ fontSize: '1.5rem' }} />
			</div>
			<Button label="Войти" size="small" outlined className={styles.button} />
		</div>
	);
}
