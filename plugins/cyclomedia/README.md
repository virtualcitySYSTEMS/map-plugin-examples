# Cylcomedia Plugin

Plugin to view panorama images of Cyclomedia within the VC MAP. On activation of the plugin a split screen is created. The image positions can be visualized in the VC MAP via WFS interface of Cyclomedia.

Configuration:

| Property               | Type            | default                                                         | Description                                                                                                                           |
|------------------------|-----------------|-----------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------|
| `startUpMap`           | `string`        | `Openlayers Map`                                                | Name of active VcsMap, when cyclomedia is activated (map name as defined in map section of config.json)                               |
| `activeOnStartup`      | `boolean`       | `false`                                                         | Whether to open cyclomedia on startup                                                                                                 |
| `startingPosition`     | `ol.Coordinate` | `undefined`                                                     | Optional starting position in EPSG:4326, if `activeOnStartup === true`                                                                |
| `url`                  | `string`        | https://streetsmart.cyclomedia.com/api/v19.19/StreetSmartApi.js | URL to the cyclomedia application                                                                                                     |
| `user`                 | `string`        |                                                                 | Cyclomedia User                                                                                                                       |
| `password`             | `string`        |                                                                 | Cyclomedia Password                                                                                                                   |
| `apiKey`               | `string`        |                                                                 | Cyclomedia API Key                                                                                                                    |
| `locale`               | `string`        | en-us                                                           | Cyclomedia locale                                                                                                                     |
| `addressSettings`      | `Object`        | { "locale": "us", "database": "Nokia" }                         | Cyclomedia address settings                                                                                                           |
| `configurationUrl`     | `string`        | https://atlas.cyclomedia.com/configuration/                     | URL to Cyclomedia configuration                                                                                                       |
| `srs`                  | `Object`        | (vcMAP projection is used per default)                          | optional srs definition for Cyclomedia application and WFS. If this parameter is omitted the projection of the vcMAP is used instead. |
| `recordingsBaseUrl`    | `string`        | https://atlas.cyclomedia.com/recording/wfs?                     | base URL of Cyclomedia recordings WFS                                                                                                 |
| `recordingsColorRGBA`  | `Array<Number>` | [0, 128, 255, 0.4]                                              | color of recordings (rgba)                                                                                                            |
| `recordingsBalloonKey` | `string`        | address                                                         | key of recordings property, which can be visualized in a balloon                                                                      |
| `startUpLayer`         | `string`        | layerName                                                       | layerName of base map, which will be activated on startup, e.g. OSM-layer                                                             |
| `startUpZoomDistance`  | `number`        |                                                                 | startup distance of camera to ground in meter (e.g. 150). This is equivalent to a zoom level parameter                                |
| `cameraOptions3D`      | `Object`        | { "heightReference": "cyclomedia", "offset": 0 }                | additional camera options for 3D map, offset to ground in meter                                                                       |
| `actionButton`         | `boolean`       | false                                                           | show cyclomedia plugin button as separate toolbox button                                                                              |

The srs for the Date `ETRS89 / UTM zone 32N + DHHN92 height` should be defined as:

```
"srs": {
    "epsg": "EPSG:5555",
    "proj4": "+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"
}
```

