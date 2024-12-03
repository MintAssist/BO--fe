<template>
	<div class="edit-user-page">
		<a-card title="Edit User" bordered>
			<a-form :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol" ref="formRef">
				<!-- Email -->
				<a-form-item label="Email" name="email" :rules="[
				]" :disabled=true>
					<a-input v-model:value="formState.email" placeholder="Enter email" />
				</a-form-item>
				<!-- Role -->
				<a-form-item label="Role" name="role" :rules="[{ required: true, message: 'Role is required' }]">
					<a-radio-group v-model:value="formState.role">
						<a-radio value="admin">Admin</a-radio>
						<a-radio value="user">User</a-radio>
						<a-radio value="superAdmin">Super admin</a-radio>
					</a-radio-group>
				</a-form-item>

				<!-- State -->
				<a-form-item label="State" name="state" :rules="[{ required: true, message: 'State is required' }]">
					<a-radio-group v-model:value="formState.state">
						<a-radio value="isVerifying">Is Verifying</a-radio>
						<a-radio value="activated">Activated</a-radio>
						<a-radio value="deactivated">Deactivated</a-radio>
					</a-radio-group>
				</a-form-item>

				<!-- Submit & Cancel Buttons -->
				<a-form-item :wrapper-col="{ span: 14, offset: 4 }">
					<a-button type="primary" @click="onSubmit">Update</a-button>
					<a-button @click="handleReset" style="margin-left: 10px">Cancel</a-button>
				</a-form-item>
			</a-form>
		</a-card>
	</div>
	<div class="edit-user-page">
		<a-card title="Edit User Info" bordered>
			<a-form :model="formStateUserInfo" :label-col="labelCol" :wrapper-col="wrapperCol" ref="formRef">
				<!-- First Name -->
				<a-form-item label="First Name" name="firstName" :rules="[
					{ required: true, message: 'First Name is required' },
					{ type: 'string', message: 'Invalid first name format' },
					{ min: 2, max: 50, message: 'First Name must be between 2 and 50 digits' }
				]">
					<a-input v-model:value="formStateUserInfo.firstName" placeholder="Enter first name" />
				</a-form-item>

				<!-- Last Name -->
				<a-form-item label="Last Name" name="lastName" :rules="[
					{ required: true, message: 'Last Name is required' },
					{ type: 'string', message: 'Invalid last name format' },
					{ min: 2, max: 50, message: 'Last Name must be between 2 and 50 digits' }
				]">
					<a-input v-model:value="formStateUserInfo.lastName" placeholder="Enter last name" />
				</a-form-item>

				<!-- Phone -->
				<a-form-item label="Phone" name="phone" :rules="[
					{ required: true, message: 'Phone is required' },
					{ type: 'string', pattern: /^[0-9]+$/, message: 'Phone number must be numeric' },
					{ min: 10, max: 15, message: 'Phone number must be between 10 and 15 digits' }
				]">
					<a-input v-model:value="formStateUserInfo.phone" placeholder="Enter phone" />
				</a-form-item>

				<!-- Gender -->
				<a-form-item label="Gender" name="gender" :rules="[{ required: true, message: 'Gender is required' }]">
					<a-radio-group v-model:value="formStateUserInfo.gender">
						<a-radio value="male">Male</a-radio>
						<a-radio value="female">Female</a-radio>
						<a-radio value="other">Other</a-radio>
					</a-radio-group>
				</a-form-item>

				<!-- Age -->
				<a-form-item label="Age" name="age" :rules="[
					{ required: true, message: 'Age is required' },
					{ type: 'number', message: 'Invalid age format' },
					{ min: 10, max: 120, message: 'Age must be between 18 and 120' }
				]">
					<a-input-number v-model:value="formStateUserInfo.age" placeholder="Enter age" />
				</a-form-item>

				<a-form-item label="Nation" name="nation" :rules="[]">
					<a-select v-model:value="formStateUserInfo.nation" placeholder="Select nation" show-search
						:filter-option="filterNation">
						<a-select-option v-for="nation in nationConstant" :key="nation.text" :value="nation.text">{{
							nation.text }}</a-select-option>
					</a-select>
				</a-form-item>

				<a-form-item label="Job" name="job" :rules="[]">
					<a-select v-model:value="formStateUserInfo.job" placeholder="Select job" show-search
						:filter-option="filterNation">
						<a-select-option v-for="job in jobConstant" :key="job" :value="job">{{
							job }}</a-select-option>
					</a-select>
				</a-form-item>

				<!-- Submit & Cancel Buttons -->
				<a-form-item :wrapper-col="{ span: 14, offset: 4 }">
					<a-button type="primary" @click="onSubmitUserInfo">Update</a-button>
					<a-button @click="handleResetUserInfo" style="margin-left: 10px">Cancel</a-button>
				</a-form-item>
			</a-form>
		</a-card>
	</div>
</template>

<script setup>
import { reactive, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { message } from 'ant-design-vue';
import apiClient from '@/api/apiClient';

const route = useRoute();

const labelCol = { style: { width: '150px' } };
const wrapperCol = { span: 14 };

import nationConstant from './../../shared/constant/nation'
import jobConstant from './../../shared/constant/job'


// Initialize the form state
const formState = reactive({
	email: '',
	role: '',
	state: '',
});

const formStateUserInfo = reactive({
	firstName: '',
	lastName: '',
	gender: '',
	phone: '',
	age: '',
	nation: '',
	job: '',
});

const filterNation = (input, option) => {
	return option.key.toLowerCase().includes(input.toLowerCase());
};


// Fetch user data based on ID
const fetchUserData = async () => {
	try {
		const userId = route.params.id;
		const apiUrl = `/bo/users/${userId}`;
		const response = await apiClient.get(apiUrl);
		if (response.status === 200) {
			// Populate the form fields excluding password
			formState.email = response.data.data.user.email;
			formState.role = response.data.data.user.roleKey;
			formState.state = response.data.data.user.stateKey;

			formStateUserInfo.age = response.data.data.user.age;
			formStateUserInfo.firstName = response.data.data.user.firstName;
			formStateUserInfo.lastName = response.data.data.user.lastName;
			formStateUserInfo.gender = response.data.data.user.gender;
			formStateUserInfo.phone = response.data.data.user.phone;
			formStateUserInfo.nation = response.data.data.user.nation;
			formStateUserInfo.job = response.data.data.user.job;
		} else {
			message.error('Failed to fetch user data.');
		}
	} catch (error) {
		message.error('Failed to fetch user data.');
	}
};

// Call fetchUserData when component is mounted
onMounted(() => {
	fetchUserData();
});

// Handle form submission
const onSubmit = async () => {
	try {
		// Validate fields
		if (
			!formState.email ||
			!formState.role ||
			!formState.state
		) {
			message.error('Please fill all required fields.');
			return;
		}

		const payload = {
			email: formState.email,
			role: formState.role,
			state: formState.state,
		};

		// Update user data via API
		const userId = route.params.id;
		const apiUrl = `bo/users/${userId}`;
		const response = await apiClient.put(apiUrl, payload);

		if (response.status === 200) {
			message.success('User updated successfully!');
		} else {
			message.error('Failed to update user. Please try again.');
		}
	} catch (error) {
		message.error('Error updating user.');
	}
};

const onSubmitUserInfo = async () => {
	try {
		// Validate fields
		if (
			!formStateUserInfo.firstName ||
			!formStateUserInfo.lastName ||
			!formStateUserInfo.gender ||
			!formStateUserInfo.phone ||
			!formStateUserInfo.age
		) {
			message.error('Please fill all required fields.');
			return;
		}

		// Prepare payload with data from formStateUserInfo
		const payload = {
			firstName: formStateUserInfo.firstName,
			lastName: formStateUserInfo.lastName,
			gender: formStateUserInfo.gender,
			phone: formStateUserInfo.phone,
			age: formStateUserInfo.age,
			nation: formStateUserInfo.nation,
			job: formStateUserInfo.job,
		};

		// Update user data via API
		const userId = route.params.id;
		const apiUrl = `bo/users/${userId}/user-infos`;
		const response = await apiClient.put(apiUrl, payload);

		if (response.status === 200) {
			message.success('User updated successfully!');
		} else {
			message.error('Failed to update user. Please try again.');
		}
	} catch (error) {
		message.error('Error updating user.');
	}
};

const handleReset = () => {
	formState.email = '';
	formState.role = '';
	formState.state = '';
};

const handleResetUserInfo = () => {
	formStateUserInfo.age = '';
	formStateUserInfo.firstName = '';
	formStateUserInfo.lastName = '';
	formStateUserInfo.gender = '';
	formStateUserInfo.phone = '';
	formStateUserInfo.nation = '';
	formStateUserInfo.job = '';
};
</script>

<style scoped>
.edit-user-page {
	margin: 20px auto;
}
</style>
