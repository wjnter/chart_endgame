import React, { Component } from "react";
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect,
} from "react-router-dom";
import Main from "./Main";
import SignIn from "./components/SignIn";
import { getToken } from "./utils";

const PrivateRoute = ({ component: Component, ...rest }) => (
	<Route
		{...rest}
		render={(props) =>
			getToken() !== null ? (
				<Component {...props} />
			) : (
				<Redirect
					to={{
						pathname: "/",
						state: { from: props.location },
					}}
				/>
			)
		}
	/>
);
const PrivateRouteSigned = ({ component: Component, ...rest }) => (
	<Route
		{...rest}
		render={(props) =>
			getToken() === null ? (
				<Component {...props} />
			) : (
				<Redirect
					to={{
						pathname: "/app",
						state: { from: props.location },
					}}
				/>
			)
		}
	/>
);
export default class App extends Component {
	render() {
		return (
			<div>
				<Router>
					<div>
						<Switch>
							<PrivateRouteSigned component={SignIn} exact path="/" />
							<PrivateRoute component={Main} path="/app" />
						</Switch>
					</div>
				</Router>
			</div>
		);
	}
}
