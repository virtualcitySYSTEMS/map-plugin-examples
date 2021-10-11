### Coordinate Search Plugin
Extends search widget for coordinate input

Per default coordinates can be searched in following coordinate reference systems:
- frameworks projection (defined in map config)
- geographic wgs84 (EPSG:4326)

Additionally other projections can be configured using `searchProjections`.

## Usage

Open the searchbar of the VC Map and type in a coordinate, e.g. `13.405, 52.52`.

Camera will move to the searched position and a balloon shows position in EPSG:4326 and a projected crs.

## Configuration (all optional):

| Property            | Type                                    | State    | Description                                                                                                                                 |
|---------------------|-----------------------------------------|----------|---------------------------------------------------------------------------------------------------------------------------------------------|
| `layerOptions`      | vcs.vcm.layer.Vector.Options            | optional | vector layer for the search results, see [VC Map API](https://lib.virtualcitymap.de/v4.0.x/doc/vcs.vcm.layer.Vector.html#.Options)          |
| `searchProjections` | Array.<vcs.vcm.util.Projection.Options> | optional | options for additional search projections, see [VC Map API](https://lib.virtualcitymap.de/v4.0.x/doc/vcs.vcm.util.Projection.html#.Options) |
| `balloonInfo`       | string &#124; Array\<string\>           | optional | balloon template per default including title, position wgs 84 and position projected                                                        |
| `title`             | string &#124; Array\<string\>           | optional | template for title of search result                                                                                                         |
| `i18n`              | Object                                  | optional | Object containing i18n tokens and messages for each available language (per default "de" & "en")                                            |
