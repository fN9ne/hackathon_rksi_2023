export const getMonthName = (number, short, eng) => {
	const months = {
		1: { full: "Январь", short: "Янв", eng: "Jan" },
		2: { full: "Февраль", short: "Фев", eng: "Febg" },
		3: { full: "Март", short: "Мар", eng: "Mar" },
		4: { full: "Апрель", short: "Апр", eng: "Apr" },
		5: { full: "Май", short: "Май", eng: "May" },
		6: { full: "Июнь", short: "Июн", eng: "Jun" },
		7: { full: "Июль", short: "Июль", eng: "Jul" },
		8: { full: "Август", short: "Авг", eng: "Aug" },
		9: { full: "Сентябрь", short: "Сен", eng: "Sep" },
		10: { full: "Октябрь", short: "Окт", eng: "Oct" },
		11: { full: "Ноябрь", short: "Нояб", eng: "Nov" },
		12: { full: "Декабрь", short: "Дек", eng: "Dec" },
	};

	return eng
		? Object.values(months).filter((item) => item.full === number)[0].eng
		: short
		? months[number].short
		: months[number].full;
};

export const date = (date = new Date(), increase = false, time = false) => {
	const hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
	const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();

	return `${date.getDate() + (increase ? 1 : 0)} ${getMonthName(date.getMonth() + 1)}${time ? `, ${hours}:${minutes}` : ""}`;
};

export const genereatePassword = () => {
	const ascii = "abcdefghijklmnopqrstuvwxyz0123456789_,-.";

	let result = "";

	for (let i = 0; i < 16; i++) {
		result += ascii[Math.floor(Math.random() * ascii.length)];
	}

	return result;
};
