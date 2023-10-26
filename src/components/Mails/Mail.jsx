import { useEffect, useRef } from "react";
import emailjs from "emailjs-com";

const Mail = ({ children, template, sending, off }) => {
	const sendEmail = () => {
		emailjs.sendForm("service_i9x3duj", template, formRef.current, "lqCwNVvKUG13eZx6e");

		console.log("Письмо отправлено!");

		off();
	};

	const formRef = useRef();

	useEffect(() => {
		if (sending) {
			sendEmail();
		}
	}, [sending]);

	return (
		<form ref={formRef} className="mail">
			{children}
		</form>
	);
};

export default Mail;
