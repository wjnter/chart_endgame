import React from 'react';
import addNotification from "react-push-notification";

const Page = ({ trigger }) => {
	const buttonClick = () => {
		addNotification({
			title: "Warning",
			subtitle: "This is a subtitle",
			message: "This is a very long message",
			theme: "darkblue",
			native: true, // when using native, your OS will handle theming.
		});
	};
	trigger && buttonClick()
	return (
		<>
		</>
	);
};

export default Page;
