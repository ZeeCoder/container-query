# API

## Container (Runtime)

**Instantiation**

`new Container(Element, statsJSON, options)`

Where `Element` is an HTMLElement, `statsJSON` is a json object from the PostCSS
plugin, and options are extra options about how the instance should behave.

**Default options:**

```js
{
    adjustOnResize: false, // Will be true by default in ^2.0.0
    adjustOnInstantiation: true
}
```

- *adjustOnResize*: If true, then the container will readjust itself based on the
element's height automatically.
This is done by using a [ResizeObserver](https://github.com/que-etc/resize-observer-polyfill) polyfill.
- *adjustOnInstantiation*: Whether to do an initial adjustment call on instantiation.

These options may be useful to you, if you want to fine-tune when readjustments
should happen.

*For example*: You could optimise animations, or only readjust containers on window
resize, if that fits your needs.

**Instance methods**

- `adjust(containerDimensions)`: Calling `adjust()` will readjust the container
based on it's size. You might have the containers size already, however, in which
case you can just pass that in, so you can save the browser the layout / repaint
work: `{ width: <number>, height: <number>}`. This could be useful if you're
animating the container's size, and on each "tick" you know what the dimensions
are already.
- `observeResize()`: Makes the container observe resize events and readjust
itself automatically. Passing in the {adjustOnResize: true} option has the same
effect.
- `unobserveResize()`: Stops a container observing resize events.

## containerQuery (PostCSS plugin)

```js
postCSS([
    containerQuery({
        getJSON: function(cssPath, jsonStats) {
            // `cssPath`: the original css' path that was processed. Useful if
            // you want to save the JSON relative to the original css.
            // 
            // `jsonStats`: the json stats having all the container-related data
            // needed for the Container instances.
            // Structural Reminder:
            // {
            //   ".SomeComponent": {},
            //   ".OtherComponent": {},
            // }
            // Keys here are the selectors having the `@define-container`
            // declaration.
        }
    })
])
```
