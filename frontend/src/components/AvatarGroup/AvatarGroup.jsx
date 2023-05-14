import React, { useRef, useContext } from 'react';
import { Menu } from 'primereact/menu';
import { Toast } from 'primereact/toast';
import { Avatar } from 'primereact/avatar';
import CurrentUserContext from '../../context/CurrentUserContext';

export function AvatarGroup() {
	const userContext = useContext(CurrentUserContext);
	const { setLoggedIn, setCurrentUser, currentUser } = userContext;
	const { name } = currentUser;

	const menu = useRef(null);
	const toast = useRef(null);

	const logout = () => {
		setLoggedIn(false);
		setCurrentUser({});
	};

	const items = [
		{
			label: name,
			items: [
				{
					label: 'Личные данные',
					icon: 'pi pi-user',
					command: () => {},
				},
				{
					label: 'Настройки',
					icon: 'pi pi-cog',
					command: () => {},
				},
				{
					label: 'Пароли и безопасность',
					icon: 'pi pi-lock',
					command: () => {},
				},
				{
					label: 'Выход',
					icon: 'pi pi-sign-out',
					command: () => {
						toast.current.show({
							severity: 'success',
							summary: 'Выход',
							detail: 'Вы вышли из приложения',
							life: 3000,
						});
						logout();
					},
				},
			],
		},
	];

	return (
		<div className="card flex justify-content-center">
			<Toast ref={toast} />
			<Menu model={items} popup ref={menu} />
			<Avatar
				icon="pi pi-user"
				size="large"
				style={{ backgroundColor: '#a5b4fc', color: '#1c2127' }}
				shape="circle"
				onClick={(e) => menu.current.toggle(e)}
			/>
		</div>
	);
}
