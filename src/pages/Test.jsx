import emailjs from "emailjs-com";
import maildata from "../maildata";

const Test = () => {
	const sendForm = (event) => {
		event.preventDefault();

		emailjs.sendForm("service_i9x3duj", "template_8bqxx4a", event.target, "lqCwNVvKUG13eZx6e");
	};

	return (
		<div className="test">
			<form style={{ display: "flex", flexDirection: "column" }} action="#" onSubmit={sendForm}>
				{Object.entries(maildata).map((item) => (
					<input type="text" name={item[0]} value={item[1]} />
				))}
				<button type="submit" className="button">
					Отправить
				</button>
			</form>
		</div>
	);
};

export default Test;
