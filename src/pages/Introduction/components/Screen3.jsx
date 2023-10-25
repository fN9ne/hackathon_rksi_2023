import { useDispatch, useSelector } from "react-redux";

import Screen from "./Screen";
import Finish from "./Finish";
import Back from "./Back";
import Loader from "../../../components/Loader/Loader";

import { addMember, removeMember } from "../../../redux/intro";

import Dropdown from "../../../components/Dropdown";
import { useEffect, useState } from "react";

import TimesIcon from "../../../assets/icons/times.svg?react";

import api from "../../../api";
import { AnimatePresence, motion } from "framer-motion";
import { opacity } from "../../../animations";
import { useNavigate } from "react-router-dom";

import { board } from "../../../instances";

const Screen3 = () => {
	const [fetching, setFetching] = useState(false);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { users } = useSelector((state) => state.data);
	const { members, team, project } = useSelector((state) => state.intro);
	const { username } = useSelector((state) => state.user);

	const finish = () => {
		setFetching(true);

		api("GET").then((response) => {
			const result = response.record;
			const { teams } = result;

			const body = {
				...result,
				users: result.users.map((user) => {
					if (user.username === username || members.map((member) => member.username).includes(user.username)) {
						return { ...user, teams: [...user.teams, team] };
					}
					return user;
				}),
				teams: [
					...teams,
					{
						name: team,
						boards: [board(project)],
					},
				],
			};

			api("PUT", body)
				.then(() => setFetching(false))
				.then(() => navigate("/app/board"));
		});
	};

	return (
		<Screen title="Команда" text="Добавьте товарищей в ваш проект" step="3" finish={true}>
			<AnimatePresence>
				{fetching && (
					<motion.div {...opacity} className="loader">
						<Loader />
					</motion.div>
				)}
			</AnimatePresence>
			<div className="intro-screen__body">
				<Dropdown users={users} placeholder=" Введите юзернейм товарища" />
			</div>
			{members.length > 0 && (
				<>
					<h2 className="intro-screen__subtitle">Участники:</h2>
					<ul className="intro-screen__members">
						{members.map((member, index) => (
							<li key={index} className="intro-screen__member">
								<button
									type="button"
									onClick={() => dispatch(removeMember(member.username))}
									className="intro-screen__remove-member"
								>
									<TimesIcon />
								</button>
								<div>
									<div className="intro-screen__username">{member.username}</div>
									<div className="intro-screen__fio">{member.fio}</div>
								</div>
							</li>
						))}
					</ul>
				</>
			)}
			<div className="intro-screen__footer">
				<Back />
				<Finish finish={finish} />
			</div>
		</Screen>
	);
};

export default Screen3;
