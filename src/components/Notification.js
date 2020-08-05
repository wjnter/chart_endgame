import React from "react";
import addNotification from "react-push-notification";

const Page = (props) => {
	const Message = (title) => {
		const message = title.startsWith("burn")
			? "Đang phát hiện cháy"
			: "Đang phát hiện hiện tượng trộm gỗ";
		addNotification({
			title: "Cảnh báo tại Trạm " + title[title.length - 1],
			subtitle: "Nguy hiểm! Nguy hiểm!",
			message,
			theme: "darkblue",
			native: true, // when using native, your OS will handle theming.
		});
	};
	console.log("props auth", props.auth);
	// { burnNode1, burnNode2, timbersawNode1, timbersawNode2 }
	for (const key in props) {
		if (key === "auth") continue;
		if (props.auth) {
			props[key] && Message(key);
		} else {
			console.log("notification is turned off");
		}
	}
	// trigger && Message();
	return <div>con cac</div>;
};

export default Page;
