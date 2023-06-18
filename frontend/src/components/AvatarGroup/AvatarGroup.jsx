import React, { useRef, useContext } from 'react';
import PropTypes from 'prop-types';
import { Menu } from 'primereact/menu';
import { Avatar } from 'primereact/avatar';
import { classNames as cn } from 'primereact/utils';
import { CurrentUserContext } from '../../context';
import styles from './AvatarGroup.module.css';

export function AvatarGroup({ onUserClick, onPasswordClick, logout }) {
	const userContext = useContext(CurrentUserContext);
	const { currentUser } = userContext;
	const { username, email, picture } = currentUser;

	const menu = useRef(null);

	const items = [
		{
			command: () => {
				onUserClick(true);
			},
			// eslint-disable-next-line react/no-unstable-nested-components
			template: (item, options) => (
				<button
					type="button"
					onClick={(e) => options.onClick(e)}
					className={cn(
						options.className,
						'w-full p-link flex align-items-center'
					)}
				>
					<Avatar
						icon={picture ? '' : 'pi pi-user'}
						image={picture || ''}
						className={cn(styles.menuAvatar, 'mr-2')}
						shape="circle"
					/>
					<div className={cn(styles.menuContainer, 'flex flex-column align')}>
						<span className={cn(styles.menuName, 'font-bold')}>{username}</span>
						<span className={cn(styles.menuEmail, 'text-sm')}>{email}</span>
					</div>
				</button>
			),
		},
		{ separator: true },
		{
			label: 'Настройки',
			items: [
				{
					label: 'Пароли и безопасность',
					icon: 'pi pi-lock',
					command: () => {
						onPasswordClick(true);
					},
				},
				{
					label: 'Выход',
					icon: 'pi pi-sign-out',
					command: () => logout('Вы вышли из аккаунта!'),
				},
			],
		},
	];

	return (
		<div className="card flex justify-content-center">
			<Menu
				model={items}
				popup
				ref={menu}
				id="popup_menu"
				appendTo="self"
				className={styles.top}
			/>
			<Avatar
				icon={picture ? '' : 'pi pi-user'}
				size="large"
				image={picture || ''}
				shape="circle"
				onClick={(e) => menu.current.toggle(e)}
				aria-controls="popup_menu"
				aria-haspopup
				className={styles.avatar}
			/>
		</div>
	);
}

AvatarGroup.propTypes = {
	onUserClick: PropTypes.func.isRequired,
	onPasswordClick: PropTypes.func.isRequired,
	logout: PropTypes.func.isRequired,
};
