
import {
	accessTokenKey,
} from "./../api/base";

function isAuthenticated() {
	return !!localStorage.getItem(accessTokenKey);
}

export default (to, from, next) => {
	if (to.matched.some(record => record.meta.requiresAuth)) {
		if (!isAuthenticated()) {
			next({
				path: '/login',
				query: { redirect: to.fullPath }
			});
		}
		next()
	} 
	if (to.matched.some(record => record.meta.requiresNotAuth)) {
		if (isAuthenticated()) {
			next({
				path: '/dashboard',
			});
		}
		next()
	} 
	
	next();
}