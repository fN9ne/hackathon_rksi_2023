import "./scss/reset.scss";
import "./scss/index.scss";

import ReactDOM from "react-dom/client";
import App from "./components/App";

import { BrowserRouter } from "react-router-dom";

const Wrapper = () => {
	return (
		<BrowserRouter>
			<App />
		</BrowserRouter>
	);
};

ReactDOM.createRoot(document.querySelector(".wrapper")).render(<Wrapper />);
