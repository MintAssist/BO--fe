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

const accessTokenKey = "__knfsBOAccessToken";
const currentUserKey = "__BOcurrentUser";
const refreshTokenKey = "__knfsBORefreshToken";

export { buildApi, roles, accessTokenKey, refreshTokenKey, currentUserKey };
