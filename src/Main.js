import React, { Component } from "react";
import "./assets/css/styles.css";
import MixedChart from "./components/MixedChart";
// import { AudioPlayerProvider } from "react-use-audio-player";
// import AudioP from "./components/Audio";
import { withRouter } from "react-router-dom";
// import WARNING from "./warning.mp3";

import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

import { withStyles } from "@material-ui/core/styles";
import Card from "./components/Card";
import AppBar from "./components/AppBar";
import Test from "./components/Test";
import Title from "./components/Popover";

import { CONSTANT_TYPE, CONSTANT_TYPE_AVG, clearToken } from "./utils";

// const url = "ws://localhost:3300/";
const url = "ws://45.119.83.67:3300/";
const useStyles = (theme) => ({
	root: {
		flexGrow: 1,
		justifyContent: "center",
	},
	paper: {
		margin: "auto",
		marginBottom: 15,
		marginTop: 20,
		maxWidth: 430,
	},
	menuButton: {
		marginRight: theme.spacing(2),
	},
	title: {
		flexGrow: 1,
	},
	mainContainer: {
		marginTop: 56,
	},
});

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
			trigger: {
				burnNode1: false,
				burnNode2: false,
				timbersawNode1: false,
				timbersawNode2: false,
			},
		};
	}
	componentDidMount() {
		this.connect();
		this.handleTrigger();
	}
	componentDidUpdate(prevProps, prevState) {
		if (prevState.data[0].gas !== this.state.data[0].gas) {
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
		let clonedData = [];
		if (valueNode1 === "") {
			clonedData.push({ ...newData[0] }, { ...newData[1], [type]: valueNode2 });
		} else {
			clonedData.push({ ...newData[0], [type]: valueNode1 }, { ...newData[1] });
		}

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
				console.log("data received: ", message);
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
		const dataNode1 = this.state.data[0];
		const dataNode2 = this.state.data[1];
		const thresholdTemp = 60;
		const thresholdGas = 15;

		const isOverTemperatureNode1 = +dataNode1.temperature >= thresholdTemp;
		const isOverTemperatureNode2 = +dataNode2.temperature >= thresholdTemp;
		const isOverGasNode1 = +dataNode1.gas >= thresholdGas;
		const isOverGasNode2 = +dataNode2.gas >= thresholdGas;

		const timbersawNode1 = +dataNode1.timbersaw;
		const timbersawNode2 = +dataNode2.timbersaw;
		const burnNode1 = isOverGasNode1 || isOverTemperatureNode1;
		const burnNode2 = isOverGasNode2 || isOverTemperatureNode2;

		console.log("node1: ", +dataNode1.temperature, +dataNode1.gas);
		console.log({ burnNode1, burnNode2, timbersawNode1, timbersawNode2 });
		this.setState({
			trigger: {
				burnNode1,
				burnNode2,
				timbersawNode1,
				timbersawNode2,
			},
		});
	};

	setPlay = () => this.setState({ trigger: false });
	render() {
		const { ws, category, data, avgDailyData, trigger } = this.state;
		const { classes } = this.props;
		return (
			<div className={classes.root}>
				<AppBar
					burnNode1={trigger.burnNode1}
					burnNode2={trigger.burnNode2}
					timbersawNode1={trigger.timbersawNode1}
					timbersawNode2={trigger.timbersawNode2}
				/>
				<Grid
					className={classes.mainContainer}
					container
					alignItems="center"
					justify="space-evenly"
				>
					<Grid item md={10}>
						<div className={classes.root}>
							{data.map((d, idx) => (
								<React.Fragment key={idx}>
									<Grid container alignItems="center" justify="space-evenly">
										<Title
											title={"Trạng thái Trạm " + (idx + 1)}
											location="Nhà bà 8"
										/>
										<Grid container alignItems="center">
											<Grid md={3} sm={6} xs={12}>
												<Card
													title={"Nhiệt độ"}
													content={d.temperature}
													footer={
														d.temperature >= 60
															? "Nhiệt độ đang bất thường"
															: "Nhiệt độ đang ổn định"
													}
													warning={d.temperature >= 60}
													color="linear-gradient(60deg, #ffa726, #fb8c00)"
												/>
											</Grid>
											<Grid md={3} sm={6} xs={12}>
												<Card
													title={"Nồng độ CO"}
													content={d.gas}
													footer={
														d.gas >= 60
															? "Nồng độ CO đang bất thường"
															: "Nồng độ CO đang ổn định"
													}
													warning={d.gas >= 60}
													color="linear-gradient(60deg, #92ABC1, #6C757D)"
												/>
											</Grid>
											<Grid md={3} sm={6} xs={12}>
												<Card
													title={"Pin"}
													content={d.battery}
													footer={
														d.battery <= 40
															? "Năng lượng thấp, cần sạc"
															: "Năng lượng ổn định"
													}
													warning={d.battery <= 40}
													color="linear-gradient(60deg, #26c6da, #00acc1)"
												/>
											</Grid>
											<Grid md={3} sm={6} xs={12}>
												<Card
													title={"Trộm gỗ"}
													content={d.timbersaw}
													footer={
														d.timbersaw === "1"
															? "Khu rừng an toàn"
															: "Khu rừng đang bị đe dọa"
													}
													color="linear-gradient(60deg, #ef5350, #e53935)"
													status
													warning={d.timbersaw === "0"}
												/>
											</Grid>
										</Grid>
									</Grid>
								</React.Fragment>
							))}
							<Grid className="chart-container" container>
								<ChartGroup
									data={data}
									category={category}
									title="Biểu đồ hiển thị Trạm"
								/>
								<Test avgDailyData={avgDailyData} ws={ws} />
							</Grid>
						</div>
					</Grid>
				</Grid>
				{/* <button onClick={this.setPlay}>{trigger ? "Play" : "Pause"}</button>
				<AudioPlayerProvider>
					<AudioP file={WARNING} trigger={trigger} />
				</AudioPlayerProvider> */}
			</div>
		);
	}
}

const styles = {
	margin: "auto",
	marginBottom: 15,
	marginTop: 20,
	marginLeft: 15,
	marginRight: 25,
	maxWidth: 430,
};

const ChartGroup = ({ data, title, category }) => {
	return (
		<Grid container justify="space-evenly" alignItems="center">
			{data.map((el, idx) => (
				<Grid key={idx} item xs={10} sm={6} md={5}>
					<h4 style={{ textAlign: "center" }}>{`${title} ${idx + 1}`}</h4>
					<Paper elevation={4} style={styles}>
						<MixedChart category={category} dataset={el} />
					</Paper>
				</Grid>
			))}
		</Grid>
	);
};

export default withRouter(withStyles(useStyles)(Main));
