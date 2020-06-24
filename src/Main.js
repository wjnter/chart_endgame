import React, { Component } from "react";
import "./App.css";
import MixedChart from "./components/MixedChart";
import AverageChart from "./components/AverageChart";
import Notification from "./components/Notification";
import { AudioPlayerProvider } from "react-use-audio-player";
import AudioP from "./components/Audio";
import WebsocketComponent from "./components/WebsocketComponent";
import { withRouter } from "react-router-dom";
import WARNING from "./warning.mp3";

import { CONSTANT_TYPE, CONSTANT_TYPE_AVG, clearToken, logs } from "./utils";

// const url = "ws://45.119.83.71:3300/";
const url = "ws://localhost:3300/";
class Main extends Component {
	constructor(props) {
		super(props);

		this.state = {
			ws: null,
			category: "",
			data: [
				{ id: "Node1", gas: "", temperature: "", battery: "" },
				{ id: "Node2", gas: "", temperature: "", battery: "" },
			],
			avgDailyData: {
				category: [],
				data: [
					{ id: "Node1", avgTemperature: [""], avgGas: [""] },
					{ id: "Node2", avgTemperature: [""], avgGas: [""] },
				],
			},
			trigger: false,
		};
	}
	componentDidMount() {
		this.connect();
		this.handleTrigger();
	}
	componentDidUpdate(prevProps, prevState) {
		if (prevState.trigger !== this.state.trigger) {
			this.handleTrigger();
		}
	}

	timeout = 250; // Initial timeout duration as a class variable

	connect = () => {
		var ws = new WebSocket(url);
		let that = this; // cache the this
		var connectInterval;

		// websocket onopen event listener
		ws.onopen = () => {
			console.log("connected websocket main component");

			this.setState({ ws });

			that.timeout = 250; // reset timer to 250 on open of websocket connection
			clearTimeout(connectInterval); // clear Interval on on open of websocket connection
		};

		// websocket onclose event listener
		ws.onclose = (e) => {
			console.log(
				`Socket is closed. Reconnect will be attempted in ${Math.min(
					10000 / 1000,
					(that.timeout + that.timeout) / 1000
				)} second.`,
				e.reason
			);

			that.timeout = that.timeout + that.timeout; //increment retry interval
			connectInterval = setTimeout(this.check, Math.min(10000, that.timeout)); //call check function after timeout
		};

		ws.onmessage = (evt) => {
			this.handleSetState(evt.data);
		};

		// websocket onerror event listener
		ws.onerror = (err) => {
			console.error(
				"Socket encountered error: ",
				err.message,
				"Closing socket"
			);

			ws.close();
		};
	};

	check = () => {
		const { ws } = this.state;
		if (!ws || ws.readyState === WebSocket.CLOSED) this.connect(); //check if websocket instance is closed, if so call `connect` function.
	};

	handleUpdateData = ({ type, valueNode1, valueNode2, category, newData }) => {
		const clonedData = [
			{ ...newData[0], [type]: valueNode1 },
			{ ...newData[1], [type]: valueNode2 },
		];
		newData = [...clonedData];
		return [newData, category];
	};

	handleSetState = (message) => {
		const dataMessage = JSON.parse(message);
		let newAvgData = [
			{
				id: "Node1",
				avgTemperature: [],
				avgGas: [],
			},
			{
				id: "Node2",
				avgTemperature: [],
				avgGas: [],
			},
		];
		let newData = [...this.state.data];
		let category = "";
		let newCategory = [];
		if (dataMessage[0] !== null) {
			if (dataMessage[0] !== "getAvgData") {
				dataMessage.map(({ type, time, valueNode1, valueNode2 }) => {
					CONSTANT_TYPE.map((item) => {
						if (item === type) {
							[newData, category] = this.handleUpdateData({
								type,
								valueNode1,
								valueNode2,
								category: time,
								newData,
							});
						}
						return true;
					});
					return true;
				});
				this.setState({
					category,
					data: newData,
				});
			} else {
				dataMessage[1].map((dataItem) => {
					newCategory.length < dataMessage[1].length / 2 &&
						newCategory.push(dataItem.date);
					newAvgData.map((newDataItem) => {
						CONSTANT_TYPE_AVG.map((typeItem) => {
							if (typeItem === dataItem.type.toLowerCase()) {
								const keyOfValue = `value${newDataItem.id}`; // -> valueNode1 or valueNode2
								newDataItem[dataItem.type].push(dataItem[keyOfValue]);
							}
							return true;
						});
						return true;
					});
					return true;
				});
				this.setState({
					avgDailyData: {
						category: newCategory,
						data: newAvgData,
					},
				});
			}
		}
	};

	logout = () => {
		//clear token
		clearToken();
		//redirect home page
		this.props.history.push("/");
	};

	handleTrigger = () => {
		const { temperature, gas } = this.state.data;
		const isOverTemperature = temperature >= 60;
		const isOverGas = gas >= 30;
		(isOverGas || isOverTemperature) && this.setState({ trigger: true });
	};

	setPlay = () => this.setState({ trigger: false });

	render() {
		const { ws, category, data, avgDailyData, trigger } = this.state;
		console.log("data", data);
		console.log("avgDailyData", avgDailyData);
		return (
			<>
				<div>Hello</div>
				{/* <Notification trigger={trigger} /> */}
				<div style={{ display: "flex" }}>
					<MixedChart category={category} dataset={data[0]} />
					<MixedChart category={category} dataset={data[1]} />
					<AverageChart
						category={avgDailyData.category}
						dataset={avgDailyData.data[0]}
					/>
				</div>

				<button onClick={this.updateData}>Update</button>
				<button onClick={this.handleUpdateData}>Update Flame</button>
				<WebsocketComponent websocket={ws} />
				<button onClick={this.logout}>Logout</button>
				{/* <button onClick={this.setPlay}>{trigger ? "Play" : "Pause"}</button>
				<AudioPlayerProvider>
					<AudioP file={WARNING} trigger={trigger} />
				</AudioPlayerProvider> */}
			</>
		);
	}
}

export default withRouter(Main);
