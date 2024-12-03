<template>
	<div class="knfs-modal-coating d-flex align-items-center justify-content-center" @click="closeModal">
		<div class="knfs-modal" @click.stop>
			<div class="knfs-modal-header d-flex justify-content-between p-3">
				<h2 class="knfs-modal-title">Search</h2>
				<button @click="closeModal" class="knfs-modal-close">
					<i class="bi bi-x-lg"></i>
				</button>
			</div>
			<div class="knfs-modal-body mt-2">
				<input type="text" class="form-control" placeholder="Type keyword ...">
				<div class="search-result">
				</div>
				<div class="search-icon d-flex flex-column justify-content-center align-items-center">
					<img src="/image-search.png" />
					<span style="font-size: 16px; font-weight: bolder;">Searching...</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { useSearchModal } from '../stores/sidebarStore';

const searchModalStore = useSearchModal();

const closeModal = () => {
	searchModalStore.toggle();
}
</script>

<style scoped>

.knfs-modal-body .search-icon {
	width: 100%;
	height: 100%;
}

.search-icon > img {
	width: 200px;
}

</style>
