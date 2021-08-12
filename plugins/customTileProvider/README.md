# customTileProvider

This is a code Example to provide a custom vectorTile Provider via Plugin. 

The Provider can be used for vectorTile layers in the config.json:

```json
{
    "name": "myVectorTileLayer",
    "type": "vcs.vcm.layer.VectorTile",
    "minLevel": 13,
    "maxLevel": 16,
    "tileProvider": {
      "type": "MyCustomTileProvider",
      "tileCacheSize": 600,
      "baseLevels": [
        15,
        16
      ],
      "url": "https://linkToRestservice/endpoint?bbox={minx},{miny},{maxx},{maxy},EPSG:4326&srsName=EPSG:4326"
    },
    "activeOnStartup": false
  }
```
