import { configureStore, combineReducers } from "@reduxjs/toolkit";

import authReducer from "./auth";
import userReducer from "./user";
import usersReducer from "./users";
import introReducer from "./intro";

const store = configureStore({
	reducer: combineReducers({
		auth: authReducer,
		user: userReducer,
		intro: introReducer,
		users: usersReducer,
	}),
});

export default store;
