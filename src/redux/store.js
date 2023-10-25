import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "./auth";

const store = configureStore({
	reducer: combineReducers({
		auth: authReducer,
	}),
});

export default store;
