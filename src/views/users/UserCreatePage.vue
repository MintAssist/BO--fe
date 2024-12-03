<template>
	<div class="create-user-page">
		<a-card title="Create New User" bordered>
			<a-form :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol" ref="formRef">
				<!-- Email -->
				<a-form-item label="Email" name="email" :rules="[
					{ required: true, message: 'Email is required' },
					{ type: 'email', message: 'Invalid email format' }
				]">
					<a-input v-model:value="formState.email" placeholder="Enter email" />
				</a-form-item>

				<!-- Password -->
				<a-form-item label="Password" name="password" :rules="[
					{ required: true, message: 'Password is required' },
					{ min: 8, max: 64, message: 'Password must be between 8 and 64 characters' },
					{ pattern: /[a-z]/, message: 'Password must include at least one lowercase letter' },
					{ pattern: /[A-Z]/, message: 'Password must include at least one uppercase letter' },
					{ pattern: /\d/, message: 'Password must include at least one number' },
					{ pattern: /[!@#$%^&*(),.?:{}|<>]/, message: 'Password must include at least one special character' }
					]">
					<a-input-password v-model:value="formState.password" placeholder="Enter password" />
				</a-form-item>

				<!-- Confirm Password -->
				<a-form-item label="Confirm Password" name="confirmPassword"
					:rules="[{ required: true, message: 'Please confirm your password' }]">
					<a-input-password v-model:value="formState.confirmPassword" placeholder="Confirm password" />
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
					<a-button type="primary" @click="onSubmit">Create</a-button>
					<a-button @click="handleReset" style="margin-left: 10px">Cancel</a-button>
				</a-form-item>
			</a-form>
		</a-card>
	</div>
</template>

<script setup>
import { reactive, toRaw } from 'vue';
import { message } from 'ant-design-vue';
import apiClient from '@/api/apiClient';

const labelCol = { style: { width: '150px' } };
const wrapperCol = { span: 14 };

const formState = reactive({
	email: '',
	password: '',
	confirmPassword: '',
	role: '',
	state: '',
});

const onSubmit = async () => {
	try {
		// Validate fields
		if (
			!formState.email ||
			!formState.role ||
			!formState.state ||
			!formState.password
		) {
			message.error('Please fill all required fields.');
			return;
		}

		if (formState.password !== formState.confirmPassword) {
			message.error('Passwords do not match!');
			return;
		}

		// Submit data to API
		const response = await apiClient.post('/bo/users', toRaw(formState));

		if (response.status === 201 || response.status === 200) {
			message.success('User created successfully!');
			handleReset();
		} else {
			message.error('Failed to create user. Please try again.');
		}
	} catch (error) {
		message.error(error.response?.data?.message || 'Failed to create user.');
	}
};

const handleReset = () => {
	formState.email = '';
	formState.password = '';
	formState.confirmPassword = '';
	formState.role = '';
	formState.state = '';
};
</script>

<style scoped>
.create-user-page {
	margin: 20px auto;
}
</style>
