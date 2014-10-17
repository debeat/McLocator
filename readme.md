#McLocator.js

Locator maps. They are a staple of news briefs and world stories. They should be easy to insert and have a consistent visual feel, that compliments rather than dominates a package.

To that end, we've created McLocator.js, a library for loading and quickly adding simple Google maps. The goal is to create responsive maps with subtle styling and streamlined user interactions while requiring a minimum of coding from the Web producer.

##Setup

McLocator is contained in a single Javascript file which loads the CSS, Google Maps API, receives calls to insert locator maps and cleans up the user data for map generation.

**NOTE:** Because Google Maps require an API key, it is recommended that you manually add your own key to the Javascript file. Alternatively, you can pass a key `gAPIkey` at runtime, however if you are using the library for a single site it is safer and more streamlined to include a default key which you could later override if you needed to use a second one.

Simply calling the JS file into your HTML, usually via a `<script>` tag will enable the `addLocator()` function.

##Use

McLocator relies on one main function for the insertion of locator maps. The `addLocator()` function queues a Google Map to be loaded.

`addLocator()` requires, at minimum, a location to mark on the map. Additional points, styling maps controls or captioning can be passed along as well.

By default, McLocator will insert a map at the point in the HTML where the `<script>` is ran, however this can be overridden by passing either a DOM node or HTML element's ID.

###I just want a quick map

The quickest way to use `addLocator()` is to simply pass it latitude and longitude coordinates, which it will then display:

```
addLocator({lat:38.899,lng:-77.035});
```

This will add a single locator map marking Washington, DC.

By default, scroll wheel and dragging options are disabled, allowing the map to appear in a story without worry of Google Maps UI elements disturbing readers.

The map will use a desaturated version of Google Map's terrain view and will start at a zoom of `7`. It will appear in a responsive box with an aspect ratio of about 3:2.

###More mapping options

If you want further controls over the locator map, there are a variety of options that can be passed to the `addLocator()` object.

* `points`: It is possible to draw more than one marker on the map. You may pass an array of points to mark. Each object in the array _must_ include a `lat` and `lng` key to plot its position. Additionally, you may include a `name` to give a point a title or an `icon` to specify what marker should be used on the map.
* `center`: By default, the map will center itself on the first (or only) point you mark. You can override this action by providing a `center` object which should include a `lat` and `lng` property.
* `title`: This will provide a title for your locator map, ideally briefly describing the point you have marked.
* `style`: If you want to use a custom map style, you may override the default styles by passing this variable. This is a [Google Maps Style JSON object](https://developers.google.com/maps/documentation/javascript/styling).
* `zoom`: You can manually set the zoom of the map. Higher numbers represent a tighter map. The default is `7`.
* `options`: You can override any of the default map options, if you desire. This uses the standard Google Maps API syntax. **Note:** Zoom and style options passed using those keys, will override zoom and style options set using the options command.
* `container`: You may specify an HTML node to insert the map at. This can be done by either passing the DOM node itself, or by passing its HTML ID attribute. Maps are inserted after document load, so it is possible to reference an ID not yet instantiated. If no container is set, a new `<div>` will be inserted after the calling `<script>` tag to be used as the container.