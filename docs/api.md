# API

## Container (Runtime)

**Instantiation**

```js
new Container(element, meta, options)
```

Where `element` is an HTMLElement, `meta` is a json object from the PostCSS
plugin, and options are extra options about how the instance should behave.

**Default options:**

```js
{
    adjustOnResize: true,
    adjustOnInstantiation: true,
    valuePrecision: 2,
}
```

* **adjustOnResize:** If true, then the container will readjust itself based on the
  element's height automatically. (uses the ResizeObserver)
* **adjustOnInstantiation:** Whether to do an initial adjustment call on instantiation.
* **valuePrecision:** "2" would produce values like "1.23px", "3" would result in
  "1.234px" and so on.

These options may be useful to you, if you want to fine-tune when readjustments
should happen.

_For example_: You could optimise for animations, or only readjust containers on
window resize, if that fits your needs.

**Instance methods**

* `adjust(containerDimensions)`: Calling `adjust()` will readjust the container
  based on it's size. You might have the containers size already, however, in which
  case you can just pass that in, so you can save the browser the layout / repaint
  work: `{ width: <number>, height: <number>}`. This could be useful if you're
  animating the container's size, and on each "tick" you know what the dimensions
  are already.
* `observeResize()`: Makes the container observe resize events and readjust
  itself automatically. Passing in the {adjustOnResize: true} option has the same
  effect.
* `unobserveResize()`: Stops a container observing resize events.

## containerQuery (PostCSS plugin)

```js
postCSS([
  containerQuery({
    getJSON: function(cssFilePath, meta) {
      // `cssFilePath`: the original css file's path that was processed. Useful
      // if you want to save the JSON relative to the original css.
      // `meta`: the JSON metadata having all the container-related data
      // needed for the Container instances.
      // It's structure was previously described in the "Multiple Containers"
      // section.
    }
  })
]);
```

**Next:** [CSS Preprocessors](css-preprocessors.md)
