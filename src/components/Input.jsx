const Input = ({ value, onChange, type, placeholder }) => {
	return (
		<div className="input">
			<input
				value={value}
				onChange={(event) => onChange(event.target.value)}
				autoComplete="on"
				type={type}
				placeholder={placeholder}
				className="input__field"
			/>
		</div>
	);
};

export default Input;
