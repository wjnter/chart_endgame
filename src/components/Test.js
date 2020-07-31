import React from "react";
import clsx from "clsx";
import "../assets/css/styles.css";
import { makeStyles } from "@material-ui/core/styles";

import Drawer from "@material-ui/core/Drawer";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";

import AverageChart from "./AverageChart";

const useStyles = makeStyles({
	list: {
		width: 250,
	},
	fullList: {
		width: "auto",
	},
});

const styles = {
	margin: "auto",
	marginBottom: 15,
	marginTop: 20,
	marginLeft: 15,
	marginRight: 25,
	maxWidth: 430,
};

const bottom = "bottom";

const AverageChartGroup = ({ data, title, category }) => {
	return (
		<Grid container justify="space-evenly" alignItems="center">
			{data.map((el, idx) => (
				<Grid key={idx} item xs={10} sm={6} md={5}>
					<h4 style={{ textAlign: "center", paddingTop: 20 }}>{`${title} ${
						idx + 1
					}`}</h4>
					<Paper elevation={5} style={styles}>
						<AverageChart category={category} dataset={el} />
					</Paper>
				</Grid>
			))}
		</Grid>
	);
};

export default function TemporaryDrawer({ avgDailyData, ws }) {
	const classes = useStyles();
	const [state, setState] = React.useState({
		bottom: false,
	});
	const handleSendMessage = () => {
		const sendMessage = () => {
			try {
				ws.send("getAvgData"); //send data to the server
			} catch (error) {
				console.log(error); // catch error
			}
		};
		sendMessage();
	};
	const toggleDrawer = (anchor, open) => (event) => {
		if (
			event.type === "keydown" &&
			(event.key === "Tab" || event.key === "Shift")
		) {
			return;
		}
		handleSendMessage();
		setState({ ...state, [anchor]: open });
	};

	const list = (anchor) => (
		<div
			className={clsx(classes.list, {
				[classes.fullList]: anchor === "top" || anchor === "bottom",
			})}
			role="presentation"
			onClick={toggleDrawer(anchor, false)}
			onKeyDown={toggleDrawer(anchor, false)}
		>
			<AverageChartGroup
				data={avgDailyData.data}
				category={avgDailyData.category}
				title="Biểu đồ giá trị trung bình Trạm"
			/>
		</div>
	);

	return (
		<React.Fragment>
			<Grid
				className="expand-button"
				onClick={toggleDrawer(bottom, true)}
				item
				xs={10}
				sm={6}
				md={5}
			>
				<KeyboardArrowUpIcon style={{ fontSize: 60 }} />
				<span style={{ margin: "-15px 0 10px 0", fontWeight: "600" }}>
					Xem Giá Trị Trung Bình
				</span>
			</Grid>
			<div></div>
			{/* <Button variant="contained" onClick={toggleDrawer(bottom, true)}>
				
				{bottom}
			</Button> */}
			<Drawer
				anchor={bottom}
				open={state[bottom]}
				onClose={toggleDrawer(bottom, false)}
			>
				{list(bottom)}
			</Drawer>
		</React.Fragment>
	);
}
