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

  componentDidMount() {
    vegaEmbed('#sunburst', vegaSpec)
  }

  componentWillUpdate(nextProps){
  }

  render() {
    return (
        <div>
          <div id="sunburst" className={ styles.sunburst }></div>
        </div>

    );
  }
}

function mapStateToProps(state)  {
  return {
    sunburstData: state.sunburstData
  }
}

// Map Redux actions to component props
function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchData }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SunburstComponent)