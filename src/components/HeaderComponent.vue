<template>
	<header class="header">
		<nav class="navbar navbar-expand-lg navbar-light bg-light justify-content-start">
			<button class="btn toggle-btn" @click="toggleSidebar">
				<span class="navbar-toggler-icon"></span>
			</button>
			<div class="activities d-flex align-items-center justify-content-end pr-3">
				<div class="notification cursor-pointer d-flex align-items-center">
					<div class="notification-more" @click="toggleUserExtend">
						<i class="bi bi-bell-fill"></i>
					</div>
				</div>
				<div class="current-user cursor-pointer d-flex align-items-center" ref="currentUser">
					<div class="current-user-more" @click="toggleUserExtend">
						<img class="current-user-img" src="/avatar-default.jpg" />
						<div class="current-user-extend-icon d-flex align-items-center">
							<i :class="['bi bi-caret-down-fill']"></i>
						</div>
					</div>
					<div v-if="isUserExtendVisible" class="current-user-extend">
						<div class="current-user-info">
							<span class="current-user-name">{{ currentUserInfo.email }}</span>
						</div>
						<ul class="current-user-action">
							<li class="current-user-action-item" @click="logOut">
								<span style="margin-right: 10px">Logout</span>
								<i class="bi bi-box-arrow-right"></i>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</nav>
	</header>
</template>


<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useSidebarStore } from '../stores/sidebarStore';
import Cookies from 'js-cookie';

import {
	currentUserKey,
	accessTokenKey,
	refreshTokenKey
} from "./../api/base";
const router = useRouter();
const sidebarStore = useSidebarStore();
// eslint-disable-next-line no-unused-vars
import apiClient from "@/api/apiClient"

import { message } from 'ant-design-vue';

const isUserExtendVisible = ref(false);
const currentUser = ref(null);

const currentUserInfo = ref({ email: 'User', avatar: '/avatar-default.jpg' });

const toggleSidebar = () => {
	sidebarStore.toggle();
};

const toggleUserExtend = () => {
	isUserExtendVisible.value = !isUserExtendVisible.value;
};

const handleClickOutside = (event) => {
	if (currentUser.value && !currentUser.value.contains(event.target)) {
		isUserExtendVisible.value = false;
	}
};

const logOut = async () => {
	try {
		const apiUrl = `/auth/sign-out`;
		const response = await apiClient.post(apiUrl, {});
		if (response.status === 204) {
			localStorage.removeItem(currentUserKey);
			localStorage.removeItem(accessTokenKey);
			Cookies.remove(refreshTokenKey)
			router.push('/login');
		} else {
			message.error('Failed to logout.');
		}
	} catch (error) {
		message.error('Failed to .');
	}

};

onMounted(() => {
	document.addEventListener('click', handleClickOutside);

	const storedUser = localStorage.getItem(currentUserKey);
	if (storedUser) {
		currentUserInfo.value = JSON.parse(storedUser);
	}
});

onUnmounted(() => {
	document.removeEventListener('click', handleClickOutside);
});
</script>


<style scoped>
.header {
	background-color: #ffffff;
	border-bottom: 1px solid #ffffff;
	display: flex;
	align-items: center;
	position: relative;
	width: 100%;
	padding-left: 10px;
	height: 60px;
}

.navbar {
	width: 100%;
	top: -2px;
	background-color: #ffffff !important;
}

.toggle-btn {
	position: absolute;
	border: none;
	background: none;

}

.current-user {
	height: 100%;
	position: relative;
}

.current-user .current-user-img {
	width: 45px;
	border-radius: 50%;
}

.current-user .current-user-info {
	padding: 10px;
	border-bottom: 1px solid #d6d6d6;
	margin-bottom: 1em;
}

.current-user-info .current-user-name {
	color: #343a40;
}

.current-user-more {
	position: relative;
}

.current-user-more .current-user-img {
	position: relative;
}

.current-user-more .current-user-extend-icon {
	position: absolute;
	z-index: 1;
	background: #f8f9fa;
	height: 14px;
	padding-top: 0.1rem;
	margin-top: -17px;
	margin-left: 25px;
	font-size: 13px;
	border-radius: 50%;
}

.current-user .current-user-extend {
	width: 300px;
	height: fit-content;
	z-index: 2;
	position: absolute;
	background-color: #f8f9fa;
	margin-top: 173px;
	margin-left: -268px;
	border: 1px solid #e5e5e5;
	box-shadow: 0px 5px 14px 1px #d6d6d6;
	border-radius: 5px;
}

.current-user-action .current-user-action-item {
	display: flex;
	align-items: center;
	text-decoration: none;
	position: relative;
	justify-content: space-between;
	height: 2.4em;
	padding-right: 2em;
}

.notification {
	height: 100%;
	position: relative;
	margin-right: 0.5em;
}

.notification .notification-more {
	position: relative;
	width: 40px;
	height: 40px;
	border-radius: 50%;
	background-color: #f0f2f5;
	padding-top: 6px;
	padding-left: 10px;
	font-size: 20px;
}

.notification-more i {
	position: absolute;
}

.activities {
	margin-left: 40px;
	width: 100%;
	padding-left: 10px;
	padding-right: 20px;
	background-color: #ffffff;
}

.toggle-btn {
	margin-right: 10px;
}

.toggle-btn .bi-list {
	font-size: 1.5rem;
}
</style>
