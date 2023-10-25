import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { opacity } from "../animations";
import { useDispatch, useSelector } from "react-redux";
import { addMember } from "../redux/intro";

const Dropdown = ({ users, placeholder }) => {
	const [focused, setFocused] = useState(false);
	const [value, setValue] = useState("");
	const [filteredUsers, setFilteredUsers] = useState(users);

	const dispatch = useDispatch();

	const { username } = useSelector((state) => state.user);
	const { members } = useSelector((state) => state.intro);

	const inputRef = useRef();
	const contentRef = useRef();

	useEffect(() => {
		const tracking = () => {
			const inputRect = inputRef.current.getBoundingClientRect();
			const contentRect = contentRef.current.getBoundingClientRect();

			if (window.innerHeight - 50 < inputRect.top + inputRect.height + contentRect.height) {
				contentRef.current.style.cssText = `
					top: ${inputRect.top - contentRect.height - 8}px;
					left: ${inputRect.left}px;
					width: ${inputRect.width}px;
				`;
			} else {
				contentRef.current.style.cssText = `
					top: ${inputRect.top + inputRect.height + 8}px;
					left: ${inputRect.left}px;
					width: ${inputRect.width}px;
				`;
			}
		};

		const observer = new ResizeObserver(tracking);

		if (focused && value.length > 0) observer.observe(document.body);

		return () => observer.disconnect();
	}, [focused, value]);

	useEffect(() => {
		setFilteredUsers(
			users
				.filter((user) => user.username !== username)
				.filter((user) => !members.map((member) => member.username).includes(user.username))
				.filter((user) => user.username.toLowerCase().startsWith(value.toLowerCase()))
		);
	}, [value, focused]);

	return (
		<div className="dropdown">
			<input
				ref={inputRef}
				type="text"
				onFocus={() => setFocused(true)}
				onBlur={() => setFocused(false)}
				value={value}
				onChange={(event) => setValue(event.target.value)}
				placeholder={placeholder}
				className="dropdown__input"
			/>
			<AnimatePresence>
				{focused && value.length > 0 && (
					<motion.div {...opacity} className="dropdown-content">
						<div
							ref={contentRef}
							className={`dropdown-content__body${filteredUsers.length > 0 ? " dropdown-content__body_big" : ""}`}
						>
							<div className="dropdown-content__track">
								<ul className="dropdown-content__list">
									{filteredUsers.length === 0 ? (
										<div className="dropdown-content__notfound">Пользователь с таким юзернеймом не найден</div>
									) : (
										filteredUsers.map((user, index) => (
											<li
												onClick={() => {
													setValue("");
													dispatch(addMember({ username: user.username, fio: `${user.firstName} ${user.lastName}` }));
												}}
												className="intro-screen__dropdown-item"
												key={index}
											>
												<div className="intro-screen__dropdown-username">{user.username}</div>
												<div className="intro-screen__dropdown-fio">{`${user.firstName} ${user.lastName}`}</div>
											</li>
										))
									)}
								</ul>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default Dropdown;
