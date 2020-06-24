import React from "react";
import { useAudioPlayer } from "react-use-audio-player";

const AudioPlayer = ({ file, trigger }) => {
	const { play, pause } = useAudioPlayer({
		src: file,
		format: "mp3",
		autoplay: false,
	});

	const turnOn = () => play();
	const turnOff = () => pause();

	trigger ? turnOn() : turnOff();
	return <></>;
};
export default AudioPlayer;
