import React, { useRef, useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { CONSTANT_TYPE_AVG } from "../utils/index";

const AverageChart = ({ dataset, category }) => {
	const initOptions = {
		chart: {
			id: "avg-chart",
			animations: {
				enabled: true,
				easing: "linear",
				speed: 1000,
				dynamicAnimation: {
					enabled: false,
				},
			},
		},
		stroke: {
			curve: "smooth",
		},
		xaxis: {
			categories: [""]
    },
  };
	const initSeries = [
		{
			name: "avgGas",
      data: [0]
		},
		{
      name: "avgTemperature",
      data: [0]
		},
	];
	const didUpdateRef = useRef(false);
	const [options, setOptions] = useState(initOptions);
	const [series, setSeries] = useState(initSeries);

	const handleUpdateData = () => {
		const newOptions = { ...options };
    let newSeries = [];
		newOptions.xaxis.categories = [...category];
		series.map(({ name: itemName, data }) => {
			const name = itemName.toLowerCase();
			CONSTANT_TYPE_AVG.map(type => {
				if (type === name) {
					const newData = [...dataset[itemName]];
					newSeries.push({ data: newData, name: itemName });
				}
				return true;
			});
			return true;
		});

		setOptions(newOptions);
		setSeries(newSeries);
	};

	useEffect(() => {
		if (didUpdateRef.current) {
			handleUpdateData();
		} else didUpdateRef.current = true;
	}, [category]);

	return (
		<Chart
			options={options}
			series={series}
			type="line"
			width={500}
			height={320}
		/>
	);
};

export default AverageChart;
