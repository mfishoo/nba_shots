import React, { Component } from 'react';
import nba from '../nba-client';
import * as d3 from 'd3';
import { hexbin } from 'd3-hexbin';
import { court, shots } from 'd3-shotchart';
import PropTypes from 'prop-types';

window.d3_hexbin = { hexbin: hexbin };

export class ShotChart extends Component {
  static propTypes = {
    playerId: PropTypes.number,
    minCount: PropTypes.number,
    chartType: PropTypes.string,
    displayTooltip: PropTypes.bool,
  };

  componentDidUpdate() {
    nba.stats.shots({ PlayerID: this.props.playerId }).then((res) => {
      console.log(res);
      const final_shots = res.shot_Chart_Detail.map((shot) => ({
        x: (shot.locX + 250) / 10,
        y: (shot.locY + 50) / 10,
        action_type: shot.actionType,
        shot_distance: shot.shotDistance,
        shot_made_flag: shot.shotMadFlag,
      }));

      const courtSelection = d3.select('#shot-chart');
      courtSelection.html('');
      const chart_court = court().width(500);
      const chart_shots = shots()
        .shotRenderThreshold(this.props.minCount)
        .displayToolTips(this.props.displayToolTip)
        .displayType(this.props.chartType);
      courtSelection.call(chart_court);
      courtSelection.datum(final_shots).call(chart_shots);
    });
  }

  render() {
    return <div id='shot-chart'></div>;
  }
}

export default ShotChart;
