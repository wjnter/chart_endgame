import React, { useRef, useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { CONSTANT_TYPE } from "../utils/index";

const MixedChart = ({ dataset, category }) => {
	const initOptions = {
		chart: {
			id: "daily-chart",
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
			categories: [""],
		},
	};
	const initSeries = [
		{
			name: "Gas",
			data: [],
		},
		{
			name: "Temperature",
			data: [],
		},
	];
	const didUpdateRef = useRef(false);
	const [options, setOptions] = useState(initOptions);
	const [series, setSeries] = useState(initSeries);

	const updateData = ({ data, name, accumulator, dataset }) => {
		const lowerCaseName = name.toLowerCase();
		// if (dataset[lowerCaseName] !== "") {
		// 	data.push(dataset[lowerCaseName]);
		// 	data.length > 10 && data.shift();
		// 	accumulator.push({ data, name });
		// }
		data.push(dataset[lowerCaseName]);
		data.length > 10 && data.shift();
		accumulator.push({ data, name });
	};

	const handleUpdateData = () => {
		if (dataset["gas"] !== "") {
			const newOptions = { ...options };
			const currentCategories = newOptions.xaxis.categories;

			let newSeries = [];
			currentCategories.push(category);
			currentCategories.length > 10 && currentCategories.shift();
			series.map(({ data: itemData, name: itemName }) => {
				const data = [...itemData];
				const name = itemName.toLowerCase();
				CONSTANT_TYPE.map((type) => {
					type === name &&
						updateData({
							data,
							name: itemName,
							accumulator: newSeries,
							dataset,
						});
				});
			});

			setOptions(newOptions);
			setSeries(newSeries);
		}
	};

	useEffect(() => {
		if (didUpdateRef.current) {
			handleUpdateData();
		} else didUpdateRef.current = true;
	}, [category]);

	return <Chart options={options} series={series} type="line" />;
};

export default MixedChart;
