import React, { Component } from "react";
import CaptionPanel from "./components/caption";
import ControlPanel from "./components/control";
import DigitPanel from "./components/digit";

class App extends Component {
	constructor() {
		super();
		this.state = {
			keyValue: "",
			calc: "",
			cur_digit: -5,
			scroll_id: 0,
			isError: false,
		};

		this.screen = null;
		this.calculator = null;

		this.displayMathProblem = function (calc) {
			if (this.screen.classList.contains("align_left"))
				this.screen.classList.toggle("align_left");
			this.screen.textContent = calc;
			this.screen.style.color = "black";
			this.setState({ isError: false, cur_digit: -5 });
		};

		this.displayWarning = function (exception) {
			this.setState({
				calc: "".concat(this.state.calc?this.state.calc.toString()+" ":"", exception.message),
				cur_digit: -5,
			});

			if (this.screen.classList.contains("align_left"))
				this.screen.classList.toggle("align_left");
			this.screen.textContent = this.state.calc;
			this.screen.style.color = "red";
			this.setState({ isError: true, cur_digit: -5 });
		};

		this.UserException = function (message) {
			this.message = message;
			this.name = "UserException";
		};
	}

	componentDidMount() {
		this.screen = document.querySelector("div#screen");
		this.calculator = document.querySelector("div.calculator");

		this.setState({
			scroll_id: setInterval(() => {
				// Интервальная функция для проверки выхода текста за границы div и автопрокрутки для удобства чтения сообщения
				if (this.screen.scrollWidth > this.screen.clientWidth) {
					++this.state.cur_digit;
					if (this.state.calc !== "" && this.state.cur_digit > 0)
						this.screen.textContent = this.state.calc.slice(
							this.state.cur_digit
						);
				} else if (
					this.state.cur_digit < this.state.calc.length &&
					this.state.cur_digit > 0
				) {
					if (!this.screen.classList.contains("align_left"))
						this.screen.classList.toggle("align_left");
					++this.state.cur_digit;
					if (this.state.calc !== "" && this.state.cur_digit > 0)
						this.screen.textContent = this.state.calc.slice(
							this.state.cur_digit
						);
				} else if (this.state.cur_digit >= this.state.calc.length) {
					this.setState({ cur_digit: -5 });
					this.screen.textContent = this.state.calc;
				}
			}, 500),
		});

		this.calculator.addEventListener("click", (event) => {
			if (!event.target.classList.contains("item")) return;
			this.setState({ keyValue: event.target.textContent });

			if (
				this.state.keyValue === "CE" ||
				(this.state.keyValue === "Delete" && this.state.isError)
			) {
				this.setState({ calc: "", isError: false });
				this.displayMathProblem(this.state.calc);
			} else if (this.state.keyValue === "Delete") {
				this.setState({ calc: this.state.calc.slice(0, -1) });
				this.displayMathProblem(this.state.calc);
			} else if (this.state.isError) {
				return;
			} else if (this.state.keyValue === "=") {
				try {
					if (this.state.calc === "") this.setState({calc:"0"});
					// Удаляем все начальные нули для корректного вычисления выражения через функцию EVAL
					this.setState({
						calc: eval(
							this.state.calc.toString().replaceAll(
								/(^|^[+-\/\*]|[+-\/\*])(0+(?=\d+))/g,
								"$1"
							)
						)
					});

					if (!Number.isFinite(this.state.calc)) {
						if (Number.isNaN(this.state.calc)) {
							throw new this.UserException(
								"Expression incorrect - result isNaN"
							);
						}
						if (this.state.calc === undefined) {
							throw new this.UserException(
								"Expression incorrect - result UNDEFINED"
							);
						}
						throw new this.UserException("Division by 0 is prohibited");
					}
					this.displayMathProblem(this.state.calc);
					this.setState({ isError: false });
				} catch (err) {
					this.displayWarning(err);
				}
			} else {
				this.setState({ calc: this.state.calc + this.state.keyValue });
				this.displayMathProblem(this.state.calc);
			}
		});
	}

	componentWillUnmount() {
		if (this.state.scroll_id > 0) {
			clearInterval(this.state.scroll_id);
			this.setState({ scroll_id: 0 });
		}
	}

	render() {
		return (
			<div className="calculator">
				<CaptionPanel />
				<ControlPanel />
				<DigitPanel />
			</div>
		);
	}
}

export default App;
