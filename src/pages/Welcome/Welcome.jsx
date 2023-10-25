import AnimatePage from "../../components/AnimatePage";
import "./Welcome.scss";

import { useNavigate } from "react-router-dom";

const Welcome = () => {
	const navigate = useNavigate();

	return (
		<AnimatePage className="welcomepage">
			<div className="welcomepage__content">
				<h1 className="welcomepage__logo">
					Flow<span>Task</span>
				</h1>
				<h3 className="welcomepage__subtitle">Планируйте, управляйте, достигайте цели</h3>
				<div className="text text_center">
					<p>
						Инновационная система управления задачами и проектами, которая позволяет легко создавать, организовывать и отслеживать
						все аспекты рабочих задач.
					</p>
					<p>
						Наше приложение обеспечивает бесперебойный рабочий процесс, повышает эффективность командной работы и помогает
						достигать поставленных целей с легкостью.
					</p>
				</div>
				<button onClick={() => navigate("/auth")} className="button">
					Начать работу
				</button>
			</div>
		</AnimatePage>
	);
};

export default Welcome;
