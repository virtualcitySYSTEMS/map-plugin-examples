# Web Service Data Export
Plugin for Data Export via WCS or WFS

Available export formats depend on the configured Web Service:
- GeoTiff
- GML
- KML
- SHAPE-ZIP
- CSV
- JSON
- ...

## Configuration

You need a running Web Service. You can use Geoserver to setup a WCS or WFS.

To configure the plugin define one or multiple WCS or WFS with the following properties:

### vcs.vcm.plugins.wsDataExport.WfsDataSource.Options
| Property  | Type                | Description                                        |
|-----------|---------------------|----------------------------------------------------|
| service   | string              | name of the web service                            |
| baseUrl   | string              | base url of the web service                        |
| user      | string              | user name                                          |
| pw        | string              | password                                           |
| format    | string              | available output format, e.g. GeoTiff              |
| coverages | Array&lt;Object&gt; | coverages with a name and label                    |
| EPSGCode  | string              | epsg code                                          |
| proj4     | string              | corresponding proj4 string                         |
| maxPixel  | number              | a upper threshold for the maximum number of pixels |

### vcs.vcm.plugins.wsDataExport.WcsDataSource.Options
| Property      | Type                | Description                                          |
|---------------|---------------------|------------------------------------------------------|
| service       | string              | name of the web service                              |
| baseUrl       | string              | base url of the web service                          |
| user          | string              | user name                                            |
| pw            | string              | password                                             |
| coverages     | Array&lt;Object&gt; | coverages with a name and label                      |
| outputFormats | Array&lt;string&gt; | available output formats, e.g. GML32, KML, JSON, ... |
| EPSGCode      | string              | epsg code                                            |
| proj4         | string              | corresponding proj4 string                           |

Example:
```json
{
  "wcs": [
    {
      "service": "geoserver",
      "baseUrl": "http://localhost:8080/geoserver/",
      "user": "",
      "pw": "",
      "format": "GeoTIFF",
      "coverages": [
        {
          "name": "exampleWCS",
          "label": "Example WCS"
        }
      ],
      "EPSGCode": "25833",
      "proj4": "+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "maxPixel": 4000000
    }
  ],
  "wfs": [
    {
      "service": "geoserver",
      "baseUrl": "http://localhost:8080/geoserver/",
      "user": "",
      "pw": "",
      "typeNames": [
        {
          "name": "exampleWFS",
          "label": "Example WFS"
        }
      ],
      "outputFormats": ["GML2", "GML3", "GML32", "KML", "SHAPE-ZIP", "CSV", "JSON"],
      "EPSGCode": "4326",
      "proj4": "+proj=longlat +datum=WGS84 +no_defs"
    }
  ]
}
```
