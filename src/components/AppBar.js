import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import AccountCircle from "@material-ui/icons/AccountCircle";
import SpaIcon from "@material-ui/icons/Spa";
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
	const logout = () => {
		//clear token
		clearToken();
		//redirect home page
		props.history.push("/");
	};
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
						Bảng thông tin
					</Typography>
					<Button color="inherit" onClick={logout}>
						<span style={{ marginTop: 7, marginRight: 7 }}>
							<AccountCircle />
						</span>
						Đăng xuất
					</Button>
				</Toolbar>
			</AppBar>
		</div>
	);
}
export default withRouter(MainAppBar);
