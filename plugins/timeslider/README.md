# Timeline Plugin

A legendItem with a slider for time dependent datasets.
Each time step is represented by a layer and can be accessed by the user via slider.

### Usage

The plugin needs no configuration itself.
It provides a specific legend item, which can be used in the legend section of your VC Map.

- Add one layer per time step to your map's `config.json`.
- Add a legend entry of type `vcs.vcm.widgets.legend.PluginItem` to your map's `config.json`
- Configure the legend entry

### Parameters of pluginItem config
| name | type | description
| ---- | ---- | -----------
| labels | Array&lt;string&gt; | The labels on the slider within the legend entry sorted by time of timeline
| layerNames | Array&lt;string&gt; | The layerNames of the corresponding layers sorted by time of timeline
| title | Object&lt;string&gt; | The title of the legend entry

### Examples

```json
{
  "type": "vcs.vcm.widgets.legend.PluginItem",
  "name": "timeslider",
  "plugin": "timeslider",
  "config": {
    "labels": [
      "0",
      "1",
      "2"
    ],
    "layerNames": [
      "layer0",
      "layer1",
      "layer2"
    ]
  },
  "title": {
    "de": "Zeitabhängige Layer",
    "en": "Timeline XXX"
  }
}

```
