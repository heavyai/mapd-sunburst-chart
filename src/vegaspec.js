const vegaSpec = (mapdData) => (
{
  "$schema": "https://vega.github.io/schema/vega/v4.json",
  "width": 600,
  "height": 600,
  "padding": 5,
  "autosize": "none",
  "signals": [
    {"name": "generate", "value": true, "bind": {"input": "checkbox"}}
  ],
  "data": [
    {
      "name": "tree",
      // "url": "https://vega.github.io/editor/data/flare.json",
      "values": mapdData,
      "transform": [
        {
          "type": "nest",
          "generate": {"signal": "generate"},
          "keys": ["category", "sub_category"]
        },
        {
          "type": "partition",
          "field": "Sales",
          "sort": {"field": "value"},
          "size": [{"signal": "2 * PI"}, {"signal": "width / 2"}],
          "as": ["a0", "r0", "a1", "r1", "depth", "children"]
        }
      ]
    }
  ],

  "scales": [
    {
      "name": "color",
      "type": "ordinal",
      "range": {"scheme": "tableau20"}
    }
  ],

  "marks": [
    {
      "type": "arc",
      "from": {"data": "tree"},
      "encode": {
        "enter": {
          "x": {"signal": "width / 2"},
          "y": {"signal": "height / 2"},
          "fill": {"scale": "color", "field": "depth"},
          "tooltip": {"signal": "datum.name ? datum.name + ', Sales: ' + datum.Sales : datum.key"}
        },
        "update": {
          "startAngle": {"field": "a0"},
          "endAngle": {"field": "a1"},
          "innerRadius": {"field": "r0"},
          "outerRadius": {"field": "r1"},
          "stroke": {"value": "white"},
          "strokeWidth": {"value": 0.5},
          "zindex": {"value": 0}
        },
        "hover": {
          "stroke": {"value": "red"},
          "strokeWidth": {"value": 2},
          "zindex": {"value": 1}
        }
      }
    }
  ]
})

export default vegaSpec