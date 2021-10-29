# Esri Search Plugin
Extends search widget using Locator ArcGIS Rest API

## Configuration:

| Property                    | Type                          | State    | Description                                          |
|-----------------------------|-------------------------------|----------|------------------------------------------------------|
| `layerOptions`              | vcs.vcm.layer.Vector.Options  | optional | vector layer for the search results                  |
| `balloonInfo`               | string &#124; Array\<string\> | optional | Structure of balloon-info                            |
| `title`                     | string &#124; Array\<string\> | optional | template for title of search result                  |
| `description`               | string &#124; Array\<string\> | optional | template for description of search result            |
| `url`                       | string                        | required | URL of the search service                            |
| `defaultQueryParams`        | Object                        | optional | default Geolocator params to be added to every query |
| `defaultAutocompleteParams` | Object                        | optional | default suggest params to be added to every suggest  |
| `zoomDistance`              | number                        | optional | the distance to use, when flying to the result       |

Example:

```json
{
  "layerOptions": {
    "projection" : {
      "epsg" : 4326
    },
    "zIndex": 30,
    "vectorProperties": {
      "altitudeMode": "relativeToGround",
      "eyeOffset" : [0, 0, -100],
      "heightAboveGround" : 10
    }
  },
  "balloonInfo": [
    "<div class='balloon' id='myBalloon'>",
    "<h1 class='balloon-title'><% if (typeof(obj.address) !== 'undefined') { %><%= obj.address %><% } %></h1>",
    "<div class='balloon-content'><p class='balloon-text'>Optional Balloon Content</p></div>",
    "   <div class='balloon-close-col'>",
    "       <button class='close-balloon'><i class='fa fa-times fa-lg'></i></button>",
    "   </div>",
    "   <div class='dialog-image-balloon'></div>",
    "   <div class='balloon-left-edge'></div>",
    "</div>"
  ],
  "title": "<% if (typeof(address) !== 'undefined') { %><%= address %><% } %>",
  "description": "Description",
  "url": "ArcGIS_Server",
  "defaultQueryParams": {
    "outSR": { "latestWkid": 4326, "wkid" :4326 },
    "outFields": "*",
    "maxLocations": 6
  },
  "defaultAutocompleteParams": {
    "maxSuggestions": 6
  },
  "zoomDistance": 50
}
```
