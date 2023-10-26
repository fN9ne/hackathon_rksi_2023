import { configureStore, combineReducers } from "@reduxjs/toolkit";

import userReducer from "./user";
import dataReducer from "./data";
import introReducer from "./intro";
import modalsReducer from "./modals";
import sidebarReducer from "./sidebar";
import boardReducer from "./board";
import mailerReducer from "./mailer";

const store = configureStore({
	reducer: combineReducers({
		user: userReducer,
		intro: introReducer,
		data: dataReducer,
		modals: modalsReducer,
		sidebar: sidebarReducer,
		board: boardReducer,
		mailer: mailerReducer,
	}),
});

export default store;
