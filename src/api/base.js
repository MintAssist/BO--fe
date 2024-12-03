const apiUrl = import.meta.env.VITE_API_URL;

function buildApi(path = "") {
	if (!path.startsWith("/")) {
		path = `/${path}`;
	}
	return `${apiUrl}${path}`;
}

const roles = [
	"admin",
	"superAdmin",
];

const accessTokenKey = "knfsAccessToken";
const currentUserKey = "currentUser";
const refreshTokenKey = "refreshToken";

export { buildApi, roles, accessTokenKey, refreshTokenKey, currentUserKey };
