<template>
	<div>
		<a-flex justify="space-between" :align="alignItems">
			<div class="table-operations">
				<!-- Clear all filters and sorters -->
				<a-button @click="clearAll" size="medium" style="margin-right: 8px;">Clear All Filters and
					Sorters</a-button>
				<!-- Clear filters -->
				<a-button @click="clearFilters" size="medium">Clear Filters</a-button>
				<!-- <a-button type="primary" :icon="h(SearchOutlined)">Search</a-button> -->
			</div>
			<div class="">
				<a-space direction="vertical">
					<router-link to="users/create">
						<a-button type="primary" :icon="h(PlusOutlined)">Create</a-button>
					</router-link>
				</a-space>
			</div>
		</a-flex>

		<a-table :columns="columns" :data-source="dataSource" :pagination="pagination" :loading="loading"
			@change="handleChange">
			<!-- Custom Filter Dropdown cho cột Email -->
			<template #customFilterDropdown="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }">
				<div style="padding: 8px">
					<a-input ref="searchInput" :placeholder="`Search ${column.dataIndex}`" :value="selectedKeys[0]"
						style="width: 188px; margin-bottom: 8px; display: block"
						@change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
						@pressEnter="handleSearch(selectedKeys, confirm, column.dataIndex)" />
					<a-button type="primary" size="small" style="width: 90px; margin-right: 8px"
						@click="handleSearch(selectedKeys, confirm, column.dataIndex)">
						<template #icon>
							<SearchOutlined />
						</template>
						Search
					</a-button>
					<a-button size="small" style="width: 90px" @click="handleReset(clearFilters)">
						Reset
					</a-button>
				</div>
			</template>


			<!-- Highlight Search Text trong Body -->
			<template #bodyCell="{ text, column, record }">
				<template v-if="column.key === 'email'">
					<router-link :to="`/users/${record._id}/edit`">
						{{ text }}
					</router-link>
				</template>
			</template>
		</a-table>
	</div>
</template>

<script setup>
import { computed, ref, reactive, onMounted } from 'vue';
import { SearchOutlined } from '@ant-design/icons-vue';
import apiClient from '@/api/apiClient';
import { DEFAULT_SIZE } from './../../shared/constant/pagination'
import { h } from 'vue';

const loading = ref(false);
const dataSource = ref([]);
const pagination = ref({ current: 1, pageSize: DEFAULT_SIZE, total: 0 });
const filteredInfo = ref({});
const sortedInfo = ref({});

const state = reactive({
	searchText: '',
	searchedColumn: '',
});

const fetchData = async (params = {}) => {
	loading.value = true;

	try {
		const formatParams = {
			...params,
			page: params.page || pagination.value.current,
			size: params.size || pagination.value.pageSize,
		}

		if (filteredInfo.value.email && filteredInfo.value.email.length > 0) {
			formatParams.email = filteredInfo.value.email[0];
		}

		const response = await apiClient.get('bo/users', {
			params: formatParams
		});

		dataSource.value = response.data.data.users || [];
		pagination.value.total = response.data.data.total || 0;
		pagination.value.current = params.page || pagination.value.current;
	} catch (error) {
		console.error('Error fetching data:', error);
	} finally {
		loading.value = false;
	}
};
const searchInput = ref();

const columns = computed(() => [
	{
		title: 'Email',
		dataIndex: 'email',
		key: "email",
		sorter: true,
		sortOrder: sortedInfo.value.columnKey === 'email' && sortedInfo.value.order,
		ellipsis: true,
		width: '30%',
		filterSearch: true,
		customFilterDropdown: true,
	},
	{
		title: 'Name',
		key: 'name',
		dataIndex: 'name',
		filterSearch: true,
		filteredValue: filteredInfo.value.name || null,
		ellipsis: true,
		width: '30%',
	},
	{
		title: 'Age',
		key: 'age',
		dataIndex: 'age',
		width: '10%',
	},
	{
		title: 'Nation',
		key: 'nation',
		dataIndex: 'nation',
		width: '20%',
		filterSearch: true,
		ellipsis: true,
	},
	{
		title: 'Job',
		key: 'job',
		dataIndex: 'job',
		width: '20%',
		filterSearch: true,
		ellipsis: true,
	},
	{
		title: 'Gender',
		key: 'gender',
		dataIndex: 'gender',
		width: '20%',
	},
	{
		title: 'Role',
		dataIndex: 'role',
		key: 'role',
		width: '20%',
		filteredValue: filteredInfo.value.role || null,
		filters: [
			{ text: 'User', value: 'user' },
			{ text: 'Admin', value: 'admin' },
			{ text: 'Super admin', value: 'superAdmin' },
		],
		sorter: true,
		sortOrder: sortedInfo.value.columnKey === 'role' && sortedInfo.value.order,
		ellipsis: true,
	},
	{
		title: 'State',
		dataIndex: 'state',
		key: 'state',
		width: '20%',
		filteredValue: filteredInfo.value.state || null,
		filters: [
			{ text: 'Activate', value: 'activated' },
			{ text: 'Is Verifying', value: 'isVerifying' },
			{ text: 'Deactivated', value: 'deactivated' },
		],
		sorter: true,
		sortOrder: sortedInfo.value.columnKey === 'state' && sortedInfo.value.order,
		ellipsis: true,
	},
	{
		title: 'Created At',
		dataIndex: 'createdAt',
		width: '20%',
	},
]);

const handleChange = (pagination, filters, sorter) => {
	filteredInfo.value = filters;
	sortedInfo.value = sorter;
	const sortRequest = {
		key: sorter.field,
		value: sorter.order == 'ascend' ? 'ASC' : 'DESC',
	}
	// filters.email = filters.email == null ? filters.email : filters.email[0];
	fetchData({
		page: pagination.current,
		size: pagination.pageSize,
		...filters,
		order: sortRequest
	});
};

const handleSearch = (selectedKeys, confirm, dataIndex) => {
	confirm();
	state.searchText = selectedKeys[0];
	state.searchedColumn = dataIndex;

	if (dataIndex === 'email') {
		filteredInfo.value.email = [state.searchText];
	}
	fetchData({
		page: pagination.value.current,
		size: pagination.value.pageSize,
		...filteredInfo.value,
	});
};


const handleReset = clearFilters => {
	clearFilters();
	state.searchText = ''; 
	filteredInfo.value = {};
	fetchData({ page: 1, size: pagination.value.pageSize });
};


const clearFilters = () => {
	filteredInfo.value = {};
	fetchData({ page: 1, size: pagination.value.pageSize });
};

const clearAll = () => {
	filteredInfo.value = {};
	sortedInfo.value = {};
	fetchData({ page: 1, size: pagination.value.pageSize });
};

onMounted(() => {
	fetchData({ page: pagination.value.current, size: pagination.value.pageSize });
});
</script>

<style scoped>
.table-operations {
	margin-bottom: 16px;
}

.table-operations>button {
	margin-right: 8px;
}

.highlight {
	background-color: rgb(255, 192, 105);
	padding: 0px;
}
</style>
