import { configureStore, combineReducers } from "@reduxjs/toolkit";

import authReducer from "./auth";
import userReducer from "./user";
import dataReducer from "./data";
import introReducer from "./intro";

const store = configureStore({
	reducer: combineReducers({
		auth: authReducer,
		user: userReducer,
		intro: introReducer,
		data: dataReducer,
	}),
});

export default store;
