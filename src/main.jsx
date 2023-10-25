import "./scss/reset.scss";
import "./scss/index.scss";

import ReactDOM from "react-dom/client";
import App from "./components/App";

import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

import store from "./redux/store";

const Wrapper = () => {
	return (
		<Provider store={store}>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</Provider>
	);
};

ReactDOM.createRoot(document.querySelector(".wrapper")).render(<Wrapper />);
