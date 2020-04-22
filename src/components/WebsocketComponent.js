import React, { Component } from "react";

class WebsocketComponent extends Component {
	sendMessage = () => {
		const { websocket } = this.props; // websocket instance passed as props to the child component.

		try {
			websocket.send("Dong dong "); //send data to the server
		} catch (error) {
			console.log(error); // catch error
		}
	};
	render() {
		return <button onClick={this.sendMessage}>Send Data</button>;
	}
}

export default WebsocketComponent;