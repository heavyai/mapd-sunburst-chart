import React, { Component, PropTypes } from 'react';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
const styles = require("./sunburst.css");
import { fetchData } from "../actions/index";
import vegaEmbed from "vega-embed"
import vegaSpec from "../vegaspec"

// React component
class SunburstComponent extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    // this.props.fetchData()
  }

  componentWillUpdate(nextProps){

    if(this.props.sunburstData){
      // const modified_data = this.props.sunburstData.unshift({"unique_id": "1", "name": "SuperStore", "category": null})
      const sunburst_data = vegaSpec(this.props.sunburstData)
      vegaEmbed('#sunburst', sunburst_data)
    }
  }

  render() {
    return (
        <div>
          <button onClick={this.props.fetchData}>Fetch Data</button>
          <div id="sunburst" className={ styles.sunburst }></div>
        </div>

    );
  }
}

function mapStateToProps(state)  {
  return {
    sunburstData: state.sunburst
  }
}

// Map Redux actions to component props
function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchData }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SunburstComponent)