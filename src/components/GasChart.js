import React, { useRef, useState, useEffect } from 'react';
import Chart from "react-apexcharts";



const GasChart = ({gasData, gasCategory}) => {
  const initOptions = {
    chart: {
      id: "gas-chart",
      animations: {
        enabled: true,
        easing: 'linear',
        speed: 1000,
        dynamicAnimation: {
          enabled: false
        }
    }
    },
    stroke: {
      curve: 'smooth'
    },
    xaxis: {
      categories: [""],
    },
  }
  const initSeries = [
    {
      name: "Gas Chart",
      data: [0],
    },
  ]
  const didUpdateRef = useRef(false)
  const [options, setOptions] = useState(initOptions);
  const [series, setSeries] = useState(initSeries);

  const handleUpdateData = () => {
    const newCategory = gasCategory;
    const newOptions = { ...options }
    const currentCategories = newOptions.xaxis.categories;
    currentCategories.push(newCategory);
    currentCategories.length > 10 && currentCategories.shift();

    const newSeries = [];
    const currentSeries = series[0];
    const newData = gasData;
    const data = [...currentSeries.data];
    data.push(newData);
    data.length > 10 && data.shift();
    
    newSeries.push({ data, name: newSeries.name });
    

    setOptions(newOptions);
    setSeries(newSeries);
  }

  useEffect(() => {
    if (didUpdateRef.current) {
      handleUpdateData();
    } else didUpdateRef.current = true;
  }, [gasCategory]);

  return (
    <Chart
      options={options}
      series={series}
      type="line"
      width={500}
      height={320}
    />
  )
}

export default GasChart;