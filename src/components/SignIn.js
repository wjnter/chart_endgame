import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { withRouter } from "react-router-dom";
import { setToken } from "../utils";

import ToastMessage from "./ToastMessage";

function Copyright() {
	return (
		<Typography
			variant="body2"
			color="textSecondary"
			align="center"
			style={{ marginBottom: 27 }}
		>
			{"Copyright © "}
			<Link color="inherit" href="https://material-ui.com/">
				End Game HCMUTE
			</Link>{" "}
			{new Date().getFullYear()}
			{"."}
		</Typography>
	);
}

const useStyles = makeStyles((theme) => ({
	paper: {
		marginTop: theme.spacing(8),
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main,
	},
	form: {
		width: "100%", // Fix IE 11 issue.
		marginTop: theme.spacing(1),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
}));
function SignIn(props) {
	const classes = useStyles();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [open, setOpen] = useState(false);

	const handleChange = (event) => {
		event.persist();
		event.target.name === "email"
			? setEmail(event.target.value)
			: setPassword(event.target.value);
	};
	const throwErr = () => {
		throw new Error("dm sai pass roi`");
	};
	const handleSubmit = async (event) => {
		event.preventDefault();
		try {
			email === "admin" && password === "admin"
				? redirectUser("/app")
				: throwErr();
			const jwt = "okdone";
			setToken(jwt);
		} catch (err) {
			setOpen(true);
			setTimeout(() => setOpen(false), 3000);
		}
	};
	const redirectUser = (path) => props.history.push(path);
	return (
		<Container component="main" maxWidth="xs" className="signin-container">
			<CssBaseline />
			<div className={classes.paper}>
				<Avatar className={classes.avatar}>
					<LockOutlinedIcon />
				</Avatar>
				<Typography component="h1" variant="h5">
					Sign in
				</Typography>
				<form className={classes.form} noValidate onSubmit={handleSubmit}>
					<TextField
						variant="outlined"
						margin="normal"
						required
						fullWidth
						id="email"
						label="Email Address"
						name="email"
						autoComplete="email"
						autoFocus
						onChange={handleChange}
					/>
					<TextField
						variant="outlined"
						margin="normal"
						required
						fullWidth
						name="password"
						label="Password"
						type="password"
						id="password"
						autoComplete="current-password"
						onChange={handleChange}
					/>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						color="primary"
						className={classes.submit}
					>
						Sign In
					</Button>
					<Box mt={8}>
						<Copyright />
					</Box>
				</form>
			</div>
			<ToastMessage open={open} />
		</Container>
	);
}

export default withRouter(SignIn);
