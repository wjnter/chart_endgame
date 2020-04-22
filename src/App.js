import React, { Component } from "react";
import "./App.css";
import Chart from "react-apexcharts";
import WebsocketComponent from './components/WebsocketComponent';

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			ws: null,
			dataFromServer: [],
			options: {
				chart: {
					id: "apexchart-example",
				},
				xaxis: {
					categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998],
				},
			},
			series: [
				{
					name: "series-1",
					data: [30, 40, 45, 50, 49, 60, 70, 91],
				},
			],
		};
	}
	componentDidMount() {
		this.connect();
	}	

	timeout = 250; // Initial timeout duration as a class variable

	connect = () => {
		var ws = new WebSocket("ws://localhost:3300/ws");
		let that = this; // cache the this
		var connectInterval;

		// websocket onopen event listener
		ws.onopen = () => {
			console.log("connected websocket main component");

			this.setState({ ws: ws });

			that.timeout = 250; // reset timer to 250 on open of websocket connection 
			clearTimeout(connectInterval); // clear Interval on on open of websocket connection
		};

		// websocket onclose event listener
		ws.onclose = e => {
			console.log(
				`Socket is closed. Reconnect will be attempted in ${Math.min(
					10000 / 1000,
					(that.timeout + that.timeout) / 1000
				)} second.`,
				e.reason
			);

			that.timeout = that.timeout + that.timeout; //increment retry interval
			connectInterval = setTimeout(this.check, Math.min(10000, that.timeout)); //call check function after timeout
		}

		ws.onmessage = evt => {
			const message = JSON.parse(evt.data)
			this.setState({dataFromServer: message})
			console.log(message)
		}

		// websocket onerror event listener
		ws.onerror = err => {
			console.error(
				"Socket encountered error: ",
				err.message,
				"Closing socket"
			);

			ws.close();
		};
	}
	check = () => {
		const { ws } = this.state;
		if (!ws || ws.readyState == WebSocket.CLOSED) this.connect(); //check if websocket instance is closed, if so call `connect` function.
	};

	updateData = () => {
		const newSeries = [];
		const newCategory = this.state.options.xaxis.categories.slice(-1)[0] + 1;
		const newOptions = { ...this.state.options }
		this.state.series.map(s => {
			const data = [...s.data];
			const newItem = Math.floor(Math.random() * 100);
			data.push(newItem);
			data.shift();
			newSeries.push({ data, name: s.name })
		})

		newOptions.xaxis.categories.push(newCategory);
		newOptions.xaxis.categories.shift();

		this.setState({
			options: newOptions,
			series: newSeries
		})
	}

	render() {
		return (
			<>
				<Chart
					options={this.state.options}
					series={this.state.series}
					type="line"
					width={500}
					height={320}
				/>
				<button onClick={this.updateData}>Update</button>
				<WebsocketComponent websocket={this.state.ws} />
			</>
		);
	}
}

export default App;
