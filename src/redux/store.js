import { configureStore, combineReducers } from "@reduxjs/toolkit";

import userReducer from "./user";
import dataReducer from "./data";
import introReducer from "./intro";
import modalsReducer from "./modals";
import sidebarReducer from "./sidebar";

const store = configureStore({
	reducer: combineReducers({
		user: userReducer,
		intro: introReducer,
		data: dataReducer,
		modals: modalsReducer,
		sidebar: sidebarReducer,
	}),
});

export default store;
