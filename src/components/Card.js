import React from "react";
import Paper from "@material-ui/core/Paper";
import "../assets/css/styles.css";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import BeenhereIcon from "@material-ui/icons/Beenhere";
import BatteryCharging90Icon from "@material-ui/icons/BatteryCharging90";
import WhatshotIcon from "@material-ui/icons/Whatshot";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import SpaIcon from "@material-ui/icons/Spa";
const Card = ({
	title,
	content,
	footer,
	color,
	status = false,
	warning = false,
}) => {
	const UNITS = {
		"Nhiệt độ": "°C",
		"Nồng độ CO": "%",
		Pin: "%",
		"Trộm gỗ": "",
	};
	const ICONS = {
		"Nhiệt độ": () => <WhatshotIcon style={{ fontSize: 40, color: "#fff" }} />,
		"Nồng độ CO": () => (
			<FavoriteBorderIcon style={{ fontSize: 40, color: "#fff" }} />
		),
		Pin: () => (
			<BatteryCharging90Icon style={{ fontSize: 40, color: "#fff" }} />
		),
		"Trộm gỗ": () => <SpaIcon style={{ fontSize: 40, color: "#fff" }} />,
	};
	return (
		<Paper className="card-container" elevation={4}>
			<div className="content">
				<div className="card card-left">
					<div className="card-left-icon" style={{ background: color }}>
						{ICONS[title]()}
					</div>
				</div>
				<div className="card card-right">
					<p className="card-left-title">{title}</p>
					<p className="card-left-content">
						{status
							? content === "1"
								? "Trạng thái tốt"
								: "Trạng thái xấu"
							: content || "0"}
					</p>
				</div>
			</div>
			<div className="footer">
				<div className="footer-wrapper">
					{warning ? (
						<ErrorOutlineIcon style={{ color: "#fb8c00" }} />
					) : (
						<BeenhereIcon style={{ color: "#43a047" }} />
					)}
					<span className="footer-content">{footer}</span>
				</div>
			</div>
		</Paper>
	);
};

export default Card;
