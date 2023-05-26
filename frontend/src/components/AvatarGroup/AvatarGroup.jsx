import React, { useRef, useContext } from 'react';
import { Menu } from 'primereact/menu';
import { Toast } from 'primereact/toast';
import { Avatar } from 'primereact/avatar';
import { classNames as cn } from 'primereact/utils';
import CurrentUserContext from '../../context/CurrentUserContext';

export function AvatarGroup() {
	const userContext = useContext(CurrentUserContext);
	const { setLoggedIn, setCurrentUser, setAllUserCalendars, setAllUserEvents, currentUser } = userContext;
	const { name, email } = currentUser;

	const menu = useRef(null);
	const toast = useRef(null);
	const toastAvatar = useRef(null);

	const logout = () => {
		localStorage.clear();
		setLoggedIn(false);
		setCurrentUser({});
    setAllUserCalendars([]);
    setAllUserEvents([]);
	};

	const items = [
		{
			command: () => {
				toastAvatar.current.show({
					severity: 'info',
					summary: 'Info',
					detail: 'Item Selected',
					life: 3000,
				});
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
						image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png"
						className="mr-2"
						shape="circle"
					/>
					<div className="flex flex-column align">
						<span className="font-bold">{name}</span>
						<span className="text-sm">{email}</span>
					</div>
				</button>
			),
		},
		{ separator: true },
		{
			// label: name,
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
			<Toast ref={toastAvatar} />
			<Toast ref={toast} />
			<Menu model={items} popup ref={menu} />
			<Avatar
				icon="pi pi-user"
				size="large"
				style={{
					backgroundColor: 'var(--primary-color)',
					color: 'var(--surface-f)',
				}}
				shape="circle"
				onClick={(e) => menu.current.toggle(e)}
			/>
		</div>
	);
}
