import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'vue-router';

import {
	buildApi,
	accessTokenKey,
	refreshTokenKey,
	currentUserKey
} from "./base"

const REFRESH_TOKEN_URL = 'auth/refresh-token';

const apiClient = axios.create({
	baseURL: buildApi(),
	timeout: 5000,
});

const getAccessToken = () => localStorage.getItem(accessTokenKey);
const getRefreshToken = () => Cookies.get(refreshTokenKey);
const saveAccessToken = (token) => localStorage.setItem(accessTokenKey, token);

apiClient.interceptors.request.use(
	(config) => {
		const token = getAccessToken();
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
	(response) => response,
	async (error) => {
		const router = useRouter();

		if (error.response && error.response.status === 401) {
			try {
				const refreshToken = getRefreshToken();
				if (!refreshToken) {
					localStorage.removeItem(accessTokenKey);
					localStorage.removeItem(currentUserKey);
					router.push('/login');
				}

				const { data } = await axios.post(buildApi(REFRESH_TOKEN_URL), { refreshToken });
				const newAccessToken = data.data.accessToken
				saveAccessToken(newAccessToken);

				error.config.headers.Authorization = `Bearer ${data.accessToken}`;
				return apiClient.request(error.config);
			} catch (refreshError) {
				Cookies.remove(refreshTokenKey);
				localStorage.removeItem(accessTokenKey);
				localStorage.removeItem(currentUserKey);
				router.push('/login');
			}
		}

		return Promise.reject(error);
	}
);

export default apiClient;
