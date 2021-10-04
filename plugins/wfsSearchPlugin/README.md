# WFS Search Plugin
Allows the searching of a WFS. Uses a RegEx to determine `tokens` to be passed to a template function.
The template function then defines the `body` of a `wfs:Query` or a `wfs:StoredQuery` (including the id).

> template always refers to an [_.template](https://underscorejs.org/#template).

## Configuration
| name              | type                                                                                                                         | description                                                                                                                                                                                               |
|-------------------|------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| projection        | string                                                                                                                       | The projection to request data in                                                                                                                                                                         |
| layerOptions      | vcs.vcm.layer.Vector.Options                                                                                                 | Result layer options, see [VC Map API](https://lib.virtualcitymap.de/v4.0.x/doc/vcs.vcm.layer.Vector.html#.Options).                                                                                      |
| balloonInfo       | string &#124; Array&lt;string&gt;                                                                                            | A balloon template to render as the balloon for result items.                                                                                                                                             |
| title             | string &#124; Array&lt;string&gt;                                                                                            |  A template string to render in the result list. Template is passed the result feature properties.                                                                                                        |
| description       | string &#124; Array&lt;string&gt;                                                                                            | A template string to render in the result list. Template is passed the result feature properties.                                                                                                         |
| isStoredQuery     | boolean                                                                                                                      | Wether this is a `wfs:StoredQuery`. Stored query filter expressions are treated _as entire Query_ not just the body of the Query. All attributes of the query tag are copied at runtime (featureType etc) |
| getFeatureOptions | [ol.format.WFS.writeGeFeatureOptions](https://openlayers.org/en/latest/apidoc/module-ol_format_WFS-WFS.html#writeGetFeature) | The options passed to writeGetFeature                                                                                                                                                                     |
| minToken          | number                                                                                                                       | The minimum number of RegEx groups to find in a given string to search. For instance if requiring both a street and house number, the count would be 2.                                                   |
| regEx             | string                                                                                                                       | The RegEx to use for tokenizing.                                                                                                                                                                          |
| filterExpression  | string &#124; Array&lt;string&gt;                                                                                            | The filter expression as a template. Is passed an array of tokens (the result of .match(regEx))                                                                                                           |

## Examples

### Normal Query:
```json
{
  "projection": "EPSG:25832",
  "layerOptions": {
    "projection": {
      "epsg": 4326
    },
    "zCoordinateEyeOffset": -100,
    "heightAboveGround": 10,
    "zIndex": 30,
    "style": {
      "fill": {
        "color": "rgba(245, 15, 15, 0.3)"
      }
    },
    "highlightStyle": {
      "fill": {
        "color": "rgba(245, 15, 15, 0.3)"
      }
    },
    "vectorProperties": {
      "altitudeMode": "clampToGround"
    }
  },
  "balloonInfo": [
    "<div class='balloon' id='myBalloon'>",
    "<h1 class='balloon-title'><% if (typeof(obj.GN) !== 'undefined') { %><%= obj.GN %><% } %></h1>",
    "<div class='balloon-content'><p class='balloon-text'>WFS NRW Geobasis</p></div>",
    "   <div class='balloon-close-col'>",
    "       <button class='close-balloon'><i class='fa fa-times fa-lg'></i></button>",
    "   </div>",
    "   <div class='dialog-image-balloon'></div>",
    "   <div class='balloon-left-edge'></div>",
    "</div>"
  ],
  "title": "<% if (typeof(GN) !== 'undefined') { %> <%= GN %><% } %>",
  "description": "WFS NRW Geobasis",
  "url": "http://localhost/wfs",
  "isStoredQurey": false,
  "minToken": 0,
  "getFeatureOptions": {
    "featureNS": "",
    "featurePrefix": "",
    "featureTypes": ["nw_dvg1_gem"],
    "maxFeatures": 3,
    "srsName": "urn:ogc:def:crs:EPSG::4326",
    "geometryName": "Polygon"
  },
  "regEx": "([a-zA-ZßäöüÄÖÜ\\.\\-\\s]+)\\s+([0-9]*)\\s*([a-zA-Z])*",
  "filterExpression": [
    "<ogc:Filter xmlns:ogc='http://www.opengis.net/ogc'>",
    "<% if(token[2]) { %>",
    "<ogc:And>",
    "<% } %>",
    "<% if(token[1]) { %>",
    "<ogc:PropertyIsLike matchCase='false' wildCard='%'>",
    "<ogc:PropertyName>STN</ogc:PropertyName>",
    "<ogc:Literal><%= token[1] %>%</ogc:Literal>",
    "</ogc:PropertyIsLike>",
    "<% if(token[2]) { %>",
    "<ogc:PropertyIsEqualTo>",
    "<ogc:PropertyName>HNR</ogc:PropertyName>",
    "<ogc:Literal>",
    "<%= token[2] %>",
    "<% if(token[3]) { %>",
    "<%= token[3] %>",
    "<% } %>",
    "</ogc:Literal>",
    "</ogc:PropertyIsEqualTo>",
    "</ogc:And>",
    "<% } %>",
    "<% } %>",
    "</ogc:Filter>"
  ]
}

```

### Stored Query:
```json
{
    "projection": "EPSG:25832",
    "layerOptions": {
      "projection": {
        "epsg": "EPSG:4326"
      },
      "zCoordinateEyeOffset": -100,
      "heightAboveGround": 10,
      "zIndex": 30,
      "style": {
        "fill": {
          "color": "rgba(245, 15, 15, 0.3)"
        },
        "image": {
          "radius": 5,
          "fill": {
            "color": "#FF00FF"
          },
          "stroke": {
            "color": "#000000",
            "width": 1
          }
        }
      },
      "highlightStyle": {
        "fill": {
          "color": "rgba(245, 15, 15, 0.3)"
        }
      },
      "vectorProperties": {
        "altitudeMode": "clampToGround"
      }
    },
    "balloonInfo": [
      "<div class='balloon' id='myBalloon'>",
      "<h1 class='balloon-title'><%= obj['str_bezl'] %> <%= obj['hnr_a'] %><% if (obj['hnrz_a']) { %> <%= obj['hnrz_a'] %><% } %></h1>",
      "<div class='balloon-content'><p class='balloon-text'>WFS Freiburg</p></div>",
      "   <div class='balloon-close-col'>",
      "       <button class='close-balloon'><i class='fa fa-times fa-lg'></i></button>",
      "   </div>",
      "   <div class='dialog-image-balloon'></div>",
      "   <div class='balloon-left-edge'></div>",
      "</div>"
    ],
    "title": "<%= obj['str_bezl'] %> <%= obj['hnr_a'] %><% if (obj['hnrz_a']) { %> <%= obj['hnrz_a'] %><% } %>",
    "description": "WFS Freiburg",
    "url": "/gdm_address",
    "getFeatureOptions": {
      "featureNS": "http://mapserver.gis.umn.edu/mapserver",
      "featurePrefix": "ms",
      "featureTypes": [
        "addresses"
      ],
      "maxFeatures": 3,
      "srsName": "urn:ogc:def:crs:EPSG::25832",
      "geometryName": "msGeometry"
    },
    "regEx": "([a-zA-ZßäöüÄÖÜ\\.\\-\\s]+)\\s+([0-9]+)\\s*([a-zA-Z])*",
    "minToken": 2,
    "isStoredQuery": true,
    "filterExpression": [
      "<StoredQuery id='<% if (token[3]) { %>findeStrasseHnrZs<% } else { %>findeStrasseHnr<% } %>' xmlns='http://www.opengis.net/wfs'>",
      "<Parameter name='strassenname'><%= token[1] %></Parameter>",
      "<Parameter name='hausnummer'><%= token[2] %></Parameter>",
      "<% if (token[3]) { %>",
      "<Parameter name='zusatz'><%= token[3] %></Parameter>",
      "<% } %>",
      "</StoredQuery>"
    ]
}
```
