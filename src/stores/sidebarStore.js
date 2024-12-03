// src/stores/sidebarStore.js
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSidebarStore = defineStore('sidebar', () => {
	const isCollapsed = ref(true);

	const toggle = () => {
		isCollapsed.value = !isCollapsed.value;
	};

	return { isCollapsed, toggle };
});

export const useSearchModal = defineStore('searchModal', () => {
	const openSearchModal = ref(false)

	const toggle = () => {
		openSearchModal.value = !openSearchModal.value;
	};

	return { openSearchModal, toggle };
})