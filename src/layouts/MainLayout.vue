<template>
	<div class="main">
		<SideBar />
		<div
			:class="[isCollapsed && !isMobile ? 'content-expanded' : 'content', isCollapsed && isMobile ? 'content-mobile-expanded' : 'content']">
			<Header />
			<Content />
		</div>
	</div>
	<Search v-if="openSearchModel" />
</template>

<script setup>
import SideBar from './../components/SideBarComponent.vue'
import Header from '../components/HeaderComponent.vue';
import Content from '../components/ContentComponent.vue'
import Search from '../components/SearchComponent.vue'

import { ref, computed, onMounted } from 'vue';
import { useSidebarStore, useSearchModal } from '../stores/sidebarStore';
const isMobile = ref(false);

const sidebarStore = useSidebarStore();
const searchModalStore = useSearchModal();

const isCollapsed = computed(() => sidebarStore.isCollapsed);
const openSearchModel = computed(() => searchModalStore.openSearchModal)

onMounted(() => {
	isMobile.value = window.innerWidth < 768;
	window.addEventListener('resize', () => {
		isMobile.value = window.innerWidth < 768;
	});
});

</script>
<style scoped>
.content {
	margin-left: 250px;
	background-color: #f2f2f2;
}

.content-mobile-extend {
	margin-left: 0px !important;
	transition: margin-left 0.3s;
}

.content-expanded {
	margin-left: 60px;
	transition: margin-left 0.3s;
}
</style>