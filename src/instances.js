export const board = ({ project }) => {
	return {
		name: project,
		purpose: "",
		deadline: "",
		rooms: [room("Комната 1")],
	};
};

export const room = (name) => {
	return {
		name: name,
		content: [column("Нужно сделать"), column("Нужно исправить"), column("В процессе"), column("Выполнено")],
	};
};

export const column = (name) => {
	return {
		name: name,
		tasks: [],
	};
};
