# Declarative Styler

A plugin to dynamically create declarative styles for numeric properties.
Optionally configuration of created styles can be downloaded as style config json.

## configuration

| Property    | Type                                   | Description                                                                                                              |
|-------------|----------------------------------------|--------------------------------------------------------------------------------------------------------------------------|
| layerNames  | string[]                               | array of layer names available in the ui for styling                                                                     |
| layerTypes  | string[]                               | alternative for `layerNames`: type of layers available in the ui for styling                                             |
| colors      | Array<{text: string, value: string[]}> | color range options with title plus start and end color, e.g.: `[{ "text": "red => green", "value": ["red", "green"] }]` |
| downloadBtn | boolean                                | whether to show download button in the ui (default: true)                                                                |
