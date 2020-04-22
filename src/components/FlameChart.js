import React, { Component } from 'react';
import Chart from "react-apexcharts";


export default class FlameChart extends Component {
  state = {
    options: {
      chart: {
        id: "flame-chart",
      },
      xaxis: {
        categories: [],
        // categories: ["init", "init", "init", "init", "init", "init", "init", "init", "init", "init"],
      },
    },
    series: [
      {
        name: "Flame Chart",
        data: [],
        // data: ["20", "20", "20", "20", "20", "20", "20", "20", "20", "20"],
      },
    ],
  };


  componentDidUpdate({prevProps}) {
    // Typical usage (don't forget to compare props):
    if (this.props.flameCategory !== prevProps.flameCategory) {
      this.handleUpdateData();
    }
  }

  handleUpdateData = () => {
    const newCategory = this.props.flameCategory;
    const newOptions = { ...this.state.options }
    const currentCategories = newOptions.xaxis.categories;
    currentCategories.push(newCategory);
    currentCategories.length > 10 && currentCategories.shift();

    const newSeries = [];
    const currentSeries = this.state.series[0];
    const newData = this.props.flameData;
    const data = [...currentSeries.data];
    data.push(newData);
    data.length > 10 && data.shift();
    
    newSeries.push({ data, name: newSeries.name });

    this.setState({
      options: newOptions,
      series: newSeries
    })
	}
  
  render() {
    return (
      <Chart
        options={this.state.options}
        series={this.state.series}
        type="line"
        width={500}
        height={320}
      />
    )
  }
}