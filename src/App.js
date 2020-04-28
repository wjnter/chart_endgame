import React, { Component } from "react";
import "./App.css";
import MixedChart from './components/MixedChart';
import WebsocketComponent from './components/WebsocketComponent';

import { CONSTANT_TYPE } from './utils/index';

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			ws: null,
			category: "",
			data: {
				flame: 0,
				gas: 0,
				temperature: 0,
				humidity: 0,
			}
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
			// const message = JSON.parse(evt.data)
			this.handleUpdateData(evt.data);
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
		if (!ws || ws.readyState === WebSocket.CLOSED) this.connect(); //check if websocket instance is closed, if so call `connect` function.
	};
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
	handleSetState = ({type, data, category}) => {
		this.setState({
			category,
			data: {
				...this.state.data,
				[type]: data,
			},
		})
	}
	
	handleUpdateData = (message) => {
		JSON.parse(message).map(({type, time, value}) => {
			CONSTANT_TYPE.map(item => item === type && this.handleSetState({type, data: value, category: time}));
			return true;
		});
	}

	render() {
		const { ws, category, data } = this.state;
		return (
			<>
				<MixedChart 
					category={category}
					dataset={data}
				/>

				<button onClick={this.updateData}>Update</button>
				<button onClick={this.handleUpdateData}>Update Flame</button>
				<WebsocketComponent websocket={ws} />
			</>
		);
	}
}

export default App;
