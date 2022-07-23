import React from 'react';
import Select from 'react-select';
import './_navbar.css';

const Navbar = ({userLang, setUserLang, userTheme,
				setUserTheme, fontSize, setFontSize}) => {
	const languages = [
		{ value: "c", label: "C" },
		{ value: "cpp", label: "C++" },
		{ value: "python", label: "Python" },
		{ value: "java", label: "Java" },
	];
	const themes = [
		{ value: "vs-dark", label: "Dark" },
		{ value: "light", label: "Light" },
	]
	return (
		<div className="navbar">
			COMPILER
			<Select options={languages} value={userLang}
					onChange={(e) => setUserLang(e.value)}
					placeholder={userLang} />
			<Select options={themes} value={userTheme}
					onChange={(e) => setUserTheme(e.value)}
					placeholder={userTheme} />
			<label>Font Size</label>
			<input type="range" min="14" max="30"
				value={fontSize} step="2"
				onChange={(e) => { setFontSize(e.target.value)}}/>
				<a href="http://hitesh-c.github.io/whiteboard" target="_blank">Whiteboard</a>
		</div>
	)
}

export default Navbar
