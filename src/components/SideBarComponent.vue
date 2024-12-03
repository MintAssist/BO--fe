<template>
	<!-- Sidebar -->
	<div :class="['sidebar', 'd-flex flex-column' , { 'sidebar-collapsed': isCollapsed && !isMobile, 'sidebar-hidden': isMobile && isSidebarHidden }]"
		:style="sidebarStyle" @mouseover="handleMouseOver" @mouseleave="handleMouseLeave">
		<!-- User Panel -->
		<div class="sidebar-header mb-4 d-flex align-items-center">
			<div class="sidebar-brand d-flex align-items-center justify-content-center">
				<img :src="!isCollapsed || isHovering ? '/logo.png' : '/logo-n-t.png'"
					:class="['logo', isCollapsed && !isHovering ? 'logo-n-t': '' ]" />
			</div>
		</div>
		<div class="sidebar-body">
			<ul :class="['nav', 'flex-column', !isCollapsed || isHovering ? '' : 'align-items-center']">
				<li class="nav-item" v-for="(item, index) in menuItems" :key="index">
					<router-link v-if="item.type === 'link'" class="nav-link" :to="item.path"
						:class="{ active: isActive(item.path) }" :style="sidebarNavStyle">
						<i :class="item.icon"></i>
						<span :class="['nav-text', !isCollapsed || isHovering ? 'ele-show' : 'ele-hidden']">{{
							item.label }}</span>
					</router-link>
					<a v-else-if="item.type === 'submenu'" :class="['nav-link', { active: isSubMenuActive(item.id) }]"
						href="#" @click="toggleSubMenu(item.id)" :style="sidebarNavStyle">
						<i :class="item.icon"></i>
						<span :class="['nav-text', !isCollapsed || isHovering ? 'ele-show' : 'ele-hidden']">{{
							item.label }}</span>
						<i
							:class="['sub-menu-icon', openSubMenu === item.id || shouldOpenSubMenu(item.id) ? 'fa-solid fa-chevron-down' : 'fa-solid fa-chevron-left', !isCollapsed || isHovering ? 'ele-show' : 'ele-hidden']"></i>
					</a>
					<span v-else-if="item.type === 'title'"
						:class="['nav-title', !isCollapsed || isHovering ? 'ele-show' : 'ele-hidden']">
						{{ item.label }}
					</span>
					<ul v-if="openSubMenu === item.id || shouldOpenSubMenu(item.id)"
						:class="['nav', 'flex-column', !isCollapsed || isHovering ? 'ele-show' : 'ele-hidden']">
						<li class="nav-item" v-for="(subItem, subIndex) in item.submenu" :key="subIndex">
							<router-link :to="subItem.path"
								:class="['nav-link', { 'sub-active': isActive(subItem.path) }]"
								:style="sidebarNavStyle">
								<span :class="['nav-text', 'ele-show']">{{ subItem.label }}</span>
							</router-link>
						</li>
					</ul>
				</li>
			</ul>
		</div>
		<div class="sidebar-footer">
			<ul class="nav flex-column">
				<li class="nav-item cursor-pointer">
					<span class="nav-link" @click=toggleSearchModal>
						<i class="bi bi-search"></i>
						<span
							:class="['nav-text', !isCollapsed || isHovering ? 'ele-show' : 'ele-hidden']">Search</span>
					</span>
				</li>
			</ul>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useSidebarStore, useSearchModal } from '../stores/sidebarStore';

const sidebarStore = useSidebarStore();
const searchModalStore = useSearchModal();

const isCollapsed = computed(() => sidebarStore.isCollapsed);
const openSubMenu = ref(null);
const isHovering = ref(false);
const isMobile = ref(false);
const isSidebarHidden = computed(() => sidebarStore.isCollapsed);

const route = useRoute();
const menuItems = [
	{ type: 'title', label: 'Common' },
	{ type: 'link', path: '/dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt' },
	{ type: 'title', label: 'User' },
	{ type: 'link', path: '/users', label: 'Users', icon: 'bi bi-person-fill' },
];

const toggleSubMenu = (menu) => {
	openSubMenu.value = openSubMenu.value === menu ? null : menu;
};

const toggleSearchModal = () => {
	searchModalStore.toggle()
}


const sidebarStyle = computed(() => ({
	width: isHovering.value || !isCollapsed.value ? '250px' : '60px',
	zIndex: isHovering.value ? 1 : 'auto'
}));

const sidebarNavStyle = computed(() => ({}));

const isActive = (path) => {
	return route.path === path || route.path.includes(path)
};

const isSubMenuActive = (menu) => menuItems
	.filter(item => item.type === 'submenu' && item.id === menu)
	.flatMap(item => item.submenu.map(sub => sub.path))
	.some(subPath => isActive(subPath));

const shouldOpenSubMenu = (menu) => isSubMenuActive(menu);

const handleMouseOver = () => {
	isHovering.value = true;
};

const handleMouseLeave = () => {
	isHovering.value = false;
};


onMounted(() => {
	isMobile.value = window.innerWidth < 768;
	window.addEventListener('resize', () => {
		isMobile.value = window.innerWidth < 768;
	});
});
</script>

<style scoped>
.sidebar {
	height: 100%;
	width: 250px;
	background-color: #ffffff;
	color: #616162;
	position: fixed;
	top: 0;
	left: 0;
	overflow: hidden;
	transition: transform 0.3s;
	border-right: #d9d9d9;
	box-shadow: 2px 0 4px rgba(0, 0, 0, 0.2);
}

.sidebar-hidden {
	transform: translateX(-100%);
}

.sidebar-collapsed {
	width: 60px;
	box-shadow: 2px 0 4px rgba(0, 0, 0, 0.2);
}

.sidebar-hidden {
	transform: translateX(-100%);
}

.sidebar-header {
	margin-top: 0px !important;
	display: flex;
	align-items: center;
	color: #616162;
	height: 60px;
	border-bottom: 1px solid #ffffff;
	background-color: #ffffff;
	transition: width 0.3s;
	z-index: 1;
}

.sidebar-brand {
	flex-grow: 1;
}

.sidebar-brand .logo {
	/* width: 50px; */
	width: 100px;
}

.sidebar-brand .logo-n-t {
	width: 36px;
}


.user-actions {
	display: flex;
	align-items: center;
}

.sidebar-body {
	overflow: hidden;
	overflow-y: hidden;
}

.sidebar-body:hover {
	overflow-y: auto;
}

.sidebar-footer {
	margin-top: auto;
}

.nav {
	padding-left: 5px;
	padding-right: 5px;
}

.nav-title {
	font-size: 16px;
	padding-left: 10px;
}

.nav-link {
	color: #404040;
	display: flex;
	align-items: center;
	text-decoration: none;
	position: relative;
	border-radius: 5px;
	height: 2.4em;
}

.nav-link .nav-text {
	margin-left: 10px;
	transition: opacity 0.3s;
	font-size: 14px;
}

.sidebar-collapsed .nav-text {
	display: none;
}

.nav-link.active {
	background-color: #eaf1fe;
	color: #1871ed;
}

.nav-link.active:hover {
	background-color: #eaf1fe;
	color: #1871ed;
}

.nav-link.active .nav-text {
	font-weight: bolder;
}

.nav-link.sub-active {
	color: #1871ed;
}

.nav-link.sub-active:hover {
	background-color: #ffffff;
}

.nav-item {
	margin-bottom: 5px;
}

.nav-item ul {
	padding-top: 5px;
	margin-left: 1.4em;
	background-color: #ffffff;
	border-left: 2px solid #8b929e93;
}

.nav-item ul .nav-item {
	padding-left: 0px;
	padding-left: 5px;
}

.nav-item ul .nav-link {
	width: 100%;
	border-radius: 5px;
	padding: 8px 0px 8px 0px;
}

.nav-link:hover {
	background-color: #f2f2f2;
}

.sub-menu-icon {
	margin-left: auto;
	transition: transform 0.3s;
}

.sub-menu-icon.fa-chevron-up {
	transform: rotate(180deg);
}

.ele-show {
	display: block !important;
}

.ele-hidden {
	display: none !important;
}
</style>
