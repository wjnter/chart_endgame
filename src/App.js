import React, { Component } from "react";
import "./App.css";
import FlameChart from './components/FlameChart';
import WebsocketComponent from './components/WebsocketComponent';

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			ws: null,
			flameCategory: "",
			flameData: ""
		};
	}
	// componentDidMount() {
	// 	this.connect();
	// }	

	// timeout = 250; // Initial timeout duration as a class variable

	// connect = () => {
	// 	var ws = new WebSocket("ws://localhost:3300/ws");
	// 	let that = this; // cache the this
	// 	var connectInterval;

	// 	// websocket onopen event listener
	// 	ws.onopen = () => {
	// 		console.log("connected websocket main component");

	// 		this.setState({ ws: ws });

	// 		that.timeout = 250; // reset timer to 250 on open of websocket connection 
	// 		clearTimeout(connectInterval); // clear Interval on on open of websocket connection
	// 	};

	// 	// websocket onclose event listener
	// 	ws.onclose = e => {
	// 		console.log(
	// 			`Socket is closed. Reconnect will be attempted in ${Math.min(
	// 				10000 / 1000,
	// 				(that.timeout + that.timeout) / 1000
	// 			)} second.`,
	// 			e.reason
	// 		);

	// 		that.timeout = that.timeout + that.timeout; //increment retry interval
	// 		connectInterval = setTimeout(this.check, Math.min(10000, that.timeout)); //call check function after timeout
	// 	}

	// 	ws.onmessage = evt => {
	// 		const message = JSON.parse(evt.data)
	// 		this.setState({dataFromServer: message})
	// 		console.log(message)
	// 	}

	// 	// websocket onerror event listener
	// 	ws.onerror = err => {
	// 		console.error(
	// 			"Socket encountered error: ",
	// 			err.message,
	// 			"Closing socket"
	// 		);

	// 		ws.close();
	// 	};
	// }
	// check = () => {
	// 	const { ws } = this.state;
	// 	if (!ws || ws.readyState == WebSocket.CLOSED) this.connect(); //check if websocket instance is closed, if so call `connect` function.
	// };
	randomData = () => {
		const randomValue = Math.floor((Math.random() * 5) + 40);
		const date = (new Date()).toString().split(" ");
		const currentDate = date.slice(1, 4).join(" ");
		const currentTime = date[4];
		return `[
			{"type": "flame", "value": "${randomValue}", "date": "${currentDate}", "time": "${currentTime}"},
			{"type": "gas", "value": "1", "date": "${currentDate}", "time": "${currentTime}"},
			{"type": "humidity", "value": "1", "date": "${currentDate}", "time": "${currentTime}"},
			{"type": "temperature", "value": "1", "date": "${currentDate}", "time": "${currentTime}"}
		]`
	}
	
	handleUpdateData = () => {
		const message = this.randomData();
		const flameData = JSON.parse(message);
		flameData.map(item => {
			if (item.type === "flame") {
				const newCategory = item.time;
				const newSeriesData = item.value;
				this.setState({
					flameCategory: newCategory,
					flameData: newSeriesData
				})
			}
		})
		// flameData.map(item => {
		// 	if (item.type === "flame") {
		// 		const newSeries = [];
		// 		const newCategory = item.time;
		// 		const newOptions = { ...this.state.options }
		// 		this.state.series.map(s => {
		// 			const data = [...s.data];
		// 			const newItem = item.value;
		// 			data.push(newItem);
		// 			data.shift();
		// 			newSeries.push({ data, name: s.name })
		// 		})
		
		// 		newOptions.xaxis.categories.push(newCategory);
		// 		newOptions.xaxis.categories.shift();
		
		// 		this.setState({
		// 			options: newOptions,
		// 			series: newSeries
		// 		})
		// 	}
		// })
	}

	render() {
		return (
			<>
				<FlameChart 
					flameData={this.state.flameData}
					flameCategory={this.state.flameCategory}
				/>
				<button onClick={this.updateData}>Update</button>
				<button onClick={this.handleUpdateData}>Update Flame</button>
				<WebsocketComponent websocket={this.state.ws} />
			</>
		);
	}
}

export default App;
