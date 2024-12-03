import { createRouter, createWebHistory } from 'vue-router';
// layout
import MainLayout from '@/layouts/MainLayout.vue';
import AuthLayout from '@/layouts/AuthLayout.vue';

// Common app
import DashboardPage from '@/views/main/DashboardPage.vue';
// import SettingsPage from '@/views/main/SettingPage.vue';
import LoginPage from '@/views/auth/LoginPage.vue';

// Users app
import UsersPage from '@/views/users/UsersPage.vue';
import UserCreatePage from '@/views/users/UserCreatePage.vue';
import UserEditPage from '@/views/users/UserEditPage.vue';

import authenticate from '@/interceptors/authenticate';

const routes = [
	{
		path: '/',
		component: AuthLayout,
		meta: { requiresNotAuth: true },
		children: [
			{
				path: 'login',
				name: 'Login',
				component: LoginPage
			}
		]
	},
	{
		path: '/',
		component: MainLayout,
		meta: { requiresAuth: true },
		children: [
			{
				path: 'dashboard',
				name: 'Dashboard',
				component: DashboardPage,
				meta: { title: 'Dashboard', breadcrumb: [{ name: 'Home', link: '/' }, { name: 'Dashboard', link: '/dashboard' }] },
			},
			{
				path: 'users',
				name: 'Users',
				component: UsersPage,
				meta: { title: 'Users', breadcrumb: [{ name: 'Home', link: '/' }, { name: 'Users', link: '/users' }] },
			},
			{
				path: 'users/create',
				name: 'User Create',
				component: UserCreatePage,
				meta: { title: 'User Create', breadcrumb: [{ name: 'Home', link: '/' }, { name: 'Users', link: '/users' }, { name: 'User Create', link: '/users/create' }] },
			},
			{
				path: 'users/:id/edit',
				name: 'User Edit',
				component: UserEditPage,
				meta: { title: 'User Edit', breadcrumb: [{ name: 'Home', link: '/' }, { name: 'Users', link: '/users' }, { name: 'User Edit', link: '/users/:id/edit' }] },
			},
		]
	},
];

const router = createRouter({
	history: createWebHistory('/'),
	routes,
});

router.beforeEach((to, from, next) => {
	const title = to.name || 'Default Title';
	document.title = title;
	next();
});

router.beforeEach(authenticate)

export default router;
