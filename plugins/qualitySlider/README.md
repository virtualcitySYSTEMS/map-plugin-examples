# Quality Slider
A small plugin which renders a slider at the bottom right. The slider takes a Display Quality
view model array. Moving the slider then sets the according display quality. This was custom made for 
an evaluation bei the Deutsche Bahn.

## Configuration
| key        | type                            | description                         |
|------------|---------------------------------|-------------------------------------|
| default    | number                          | The index of the default view model |
| viewmodels | Array&lt;QualitySliderValue&gt; | an array of slider values           |

### QualitySliderValue
| key   | type                                             | description                                                                                                               |
|-------|--------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------|
| label | string                                           | the label to render at the tick                                                                                           |
| model | vcs.vcm.widgets.DisplayQuality.ViewModel.Options | the view model, see [VC Map API](https://lib.virtualcitymap.de/v4.0.x/doc/vcs.vcm.widgets.DisplayQuality.html#.ViewModel) |
