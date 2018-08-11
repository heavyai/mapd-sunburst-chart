import React, { Component, PropTypes } from 'react';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
const styles = require("./sunburst.css");
import { fetchData } from "../actions/index";
import vegaEmbed from "vega-embed"
import * as d3 from "d3";

// React component
class SunburstComponent extends Component {
  constructor(props) {
    super(props);
    this.create_d3_sunburst = this.create_d3_sunburst.bind(this)
    this.create_sunburst = this.create_sunburst.bind(this)
  }

  componentWillMount() {
    // this.props.fetchData()
  }

  componentWillUpdate(nextProps){
    if(this.props.sunburst){
      // vegaEmbed('#vega_sunburst', this.props.sunburstData)
    }
  }

  create_sunburst() {
    this.props.fetchData()
    if(this.props.sunburst){
      // vegaEmbed('#vega_sunburst', this.props.sunburst.vega_data)
      this.create_d3_sunburst()
    }
  }

  create_d3_sunburst(){
    const width = 600,
          height = 600,
          radius = (Math.min(width, height) / 2) - 10

    const formatNumber = d3.format(",d")

    const x = d3.scale.linear()
        .range([0, 2 * Math.PI]);

    const y = d3.scale.sqrt()
        .range([0, radius]);

    const color = d3.scale.category20c();

    const partition = d3.layout.partition()
        .children(function (d) {
          return Array.isArray(d.values) ? d.values : null
        })
        .value(function(d) { return d.key; });

    const arc = d3.svg.arc()
        .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
        .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
        .innerRadius(function(d) { return Math.max(0, y(d.y)); })
        .outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); });

    const svg = d3.select("#d3_sunburst").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + (height / 2) + ")");

    svg.selectAll("path")
      .data(partition.nodes(this.props.sunburst.d3_data))
      .enter().append("path")
      .attr("d", arc)
      .style("fill", function(d) {
        return color((d.children ? d : d.key).key); })
      .style("stroke", "white")
      .on("click", click)
      .append("title")
      .text(function(d) { return d.key + "\n" + formatNumber(d.value); });

    function click(d) {
      svg.transition()
        .duration(750)
        .tween("scale", function() {
          const xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
              yd = d3.interpolate(y.domain(), [d.y, 1]),
              yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
          return function(t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); };
        })
        .selectAll("path")
        .attrTween("d", function(d) { return function() { return arc(d); }; });
    }

  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.title}>Vega Sunburst</div>
          <button className={ styles.create_button } onClick={this.create_sunburst}>Create Sunburst Chart</button>
          <div className={styles.title}>D3 Sunburst</div>
        </div>
        <div className={styles.charts} >
          <div id="vega_sunburst" className={ styles.sunburst }></div>

          <div id="d3_sunburst" className={ styles.sunburst }></div>
        </div>

      </div>

    );
  }
}

function mapStateToProps(state)  {
  return {
    sunburst: state.sunburst
  }
}

// Map Redux actions to component props
function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchData }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SunburstComponent)