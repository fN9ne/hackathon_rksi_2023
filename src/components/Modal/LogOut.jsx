import { useDispatch, useSelector } from "react-redux";

import ModalLayout from "./ModalLayout";
import Title from "./Title";
import { setLogOutVisibility } from "../../redux/modals";
import { throwUser } from "../../redux/user";
import { useNavigate } from "react-router-dom";

const LogOut = () => {
	const { logOutActive } = useSelector((state) => state.modals);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const closeModal = () => dispatch(setLogOutVisibility(false));
	const logOut = () => {
		closeModal();
		dispatch(throwUser());
		navigate("/");
	};

	return (
		<ModalLayout close={closeModal} condition={logOutActive}>
			<Title text="Выход" />
			<div className="text">Вы уверены, что хотите выйти?</div>
			<div className="modal__footer">
				<button onClick={closeModal} className="button button_back">
					Остаться
				</button>
				<button onClick={logOut} className="button">
					Выйти
				</button>
			</div>
		</ModalLayout>
	);
};

export default LogOut;
