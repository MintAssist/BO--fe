<template>
	<div class="container-fluid d-flex justify-content-center">
		<div class="login-page">
			<a-card title="Login" bordered class="login-card">
				<a-form :model="formState" name="basic" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }"
					autocomplete="off" @finish="onFinish">
					<a-form-item label="Email" name="email" :rules="[
						{ required: true, message: 'Email is required' },
						{ type: 'email', message: 'Invalid email format' }
					]">
						<a-input v-model:value="formState.email" />
					</a-form-item>

					<a-form-item label="Password" name="password"
						:rules="[
							{ required: true, message: 'Password is required' },
							{ min: 8, max: 64, message: 'Password must be between 8 and 64 characters' },
							{ pattern: /[a-z]/, message: 'Password must include at least one lowercase letter' },
							{ pattern: /[A-Z]/, message: 'Password must include at least one uppercase letter' },
							{ pattern: /\d/, message: 'Password must include at least one number' },
							{ pattern: /[!@#$%^&*(),.?:{}|<>]/, message: 'Password must include at least one special character' }
						]">
						<a-input-password v-model:value="formState.password" />
					</a-form-item>

					<a-form-item name="remember" :wrapper-col="{ offset: 8, span: 16 }">
						<a-checkbox v-model:checked="formState.rememberMe">Remember me</a-checkbox>
					</a-form-item>

					<a-form-item :wrapper-col="{ offset: 8, span: 16 }">
						<a-button type="primary" html-type="submit">Submit</a-button>
					</a-form-item>
				</a-form>

				<!-- Error Alert -->
				<a-alert v-if="errorList.length" type="error" closable show-icon>
					<template #message>
						<div v-for="(error, index) in errorList" :key="index">
							{{ error }}
						</div>
					</template>
				</a-alert>
			</a-card>
		</div>
	</div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { message } from 'ant-design-vue';
import axios from 'axios';
import Cookies from 'js-cookie';
import { buildApi, roles, accessTokenKey, refreshTokenKey, currentUserKey } from '@/api/base';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute()
const formState = reactive({
	email: '',
	password: '',
	rememberMe: false
});

const loading = ref(false);
const error = ref(null);
const showDismissibleAlert = ref(false);
const errorList = ref([]);

const onFinish = async () => {
	loading.value = true;
	error.value = null;
	errorList.value = [];
	showDismissibleAlert.value = false;

	try {
		// Validate fields manually
		if (!formState.email || !formState.password) {
			message.error('Please fill in all required fields.');
			loading.value = false;
			return;
		}

		// Submit login request
		const apiUrl = buildApi('auth/sign-in');
		const response = await axios.post(apiUrl, {
			email: formState.email,
			password: formState.password,
			rememberMe: formState.rememberMe
		}, {
			
		});

		const result = response.data;
		if (roles.includes(result.data.user.role)) {
			const accessToken = result.data.accessToken;
			const refreshToken = result.data.refreshToken;

			// Save tokens
			localStorage.setItem(accessTokenKey, accessToken);
			localStorage.setItem(currentUserKey, JSON.stringify(result.data.user));

			if (refreshToken) {
				Cookies.set(refreshTokenKey, refreshToken, { 
					expires: 30,
				 });
			}

			// Redirect to dashboard
			router.push(route.query.redirect || '/dashboard');
		} else {
			error.value = "Forbidden";
			showDismissibleAlert.value = true;
		}
	} catch (err) {
		const errorResponse = err.response;
		if (errorResponse && errorResponse.status === 400) {
			// Clear previous errors
			errorList.value = [];

			// Populate errorList with multiple errors from the response
			errorList.value = errorResponse.data.errors.map((err) => err.msg);
		} else {
			errorList.value.push('Login failed. Please try again.');
		}
		showDismissibleAlert.value = true;
	} finally {
		loading.value = false;
	}
};
</script>

<style scoped>
.login-page {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100vh;
}

.login-card {
	width: 500px;
	overflow-y: auto;
}

.w-100 {
	width: 100%;
}

.is-invalid {
	border-color: #f5222d !important;
}

.text-center {
	text-align: center;
}

.mt-3 {
	margin-top: 1rem;
}
</style>
