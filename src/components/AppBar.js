import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";

import IconButton from "@material-ui/core/IconButton";
import AccountCircle from "@material-ui/icons/AccountCircle";
import SpaIcon from "@material-ui/icons/Spa";

import Notification from "./Notification";

import { withRouter } from "react-router-dom";
import { clearToken } from "../utils";

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
	},
	menuButton: {
		marginRight: theme.spacing(2),
	},
	title: {
		flexGrow: 1,
	},
}));

function MainAppBar(props) {
	const classes = useStyles();

	const [auth, setAuth] = React.useState(true);
	const logout = () => {
		//clear token
		clearToken();
		//redirect home page
		props.history.push("/");
	};

	const handleChange = (event) => {
		setAuth(event.target.checked);
	};

	console.log("auth...", auth);
	return (
		<div className={classes.root}>
			<AppBar position="fixed">
				<Toolbar>
					<IconButton
						edge="start"
						className={classes.menuButton}
						color="inherit"
						aria-label="menu"
					>
						<SpaIcon />
					</IconButton>
					<Typography variant="h6" className={classes.title}>
						Mô hình Bảo vệ rừng ứng dụng IoT
					</Typography>
					<FormGroup>
						<FormControlLabel
							control={
								<Switch
									checked={auth}
									onChange={handleChange}
									aria-label="login switch"
								/>
							}
							label={auth ? "Tắt thông báo" : "Bật thông báo"}
						/>
					</FormGroup>
					<Button color="inherit" onClick={logout}>
						<span style={{ marginTop: 7, marginRight: 7 }}>
							<AccountCircle />
						</span>
						Đăng xuất
					</Button>
				</Toolbar>
			</AppBar>
			<Notification
				auth={auth}
				burnNode1={props.burnNode1}
				burnNode2={props.burnNode2}
				timbersawNode1={props.timbersawNode1}
				timbersawNode2={props.timbersawNode2}
			/>
		</div>
	);
}
export default withRouter(MainAppBar);
