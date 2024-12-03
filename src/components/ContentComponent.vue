
<template>
	<div class="main-content">
		<div class="title-content d-flex justify-content-between">
			<h1 v-if="titleContent">{{ titleContent }}</h1>
			<nav aria-label="breadcrumb">
				<ol class="breadcrumb">
					<li v-for="(item, index) in breadcrumb" :key="index" class="breadcrumb-item">
						<router-link v-if="item.link" :to="item.link" class="breadcrumb-route">{{ item.name }}</router-link>
						<span v-else>{{ item.name }}</span>
					</li>
				</ol>
			</nav>
		</div>
		<router-view></router-view>
	</div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const titleContent = computed(() => route.meta.title || null);
const breadcrumb = computed(() => route.meta.breadcrumb || []);


</script>

<style scoped>
.main-content {
	padding: 20px;
	background-color: #f2f2f2;
	min-height: max-content;
}

.title-content {
	margin-bottom: 20px;
}

.breadcrumb-route {
	text-decoration: none;
}

</style>
