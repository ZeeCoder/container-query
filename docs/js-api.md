# JS API

This document describes the Container runtime, which is used internally in the
react-container-query modules.

Support for other UI libraries can be implemented using this.

## Instantiation

```js
new Container(element, meta, options);
```

Where `element` is an HTMLElement, `meta` is a json object from the PostCSS
plugin, and options are extra options about how the instance should behave.

**Default options:**

```js
{
    adjustOnResize: true,
    adjustOnInstantiation: true,
    valuePrecision: 0,
}
```

- **adjustOnResize:** If true, then the container will readjust itself based on the
  element's height automatically. (Using ResizeObserver.)
- **adjustOnInstantiation:** Whether to do an initial adjustment call on instantiation.
- **valuePrecision:** "0" Produces whole values like "1px". Setting it to "3"
  would result in values like "1.234px".

These options may be useful to you, if you want to fine-tune when readjustments
should happen.

_For example_: You could optimise for animations, or only readjust containers on
window resize, if that fits your needs.

## Instance methods

- `adjust(containerDimensions)`: Calling `adjust()` will readjust the container
  based on it's size. You might have the containers size already, in which
  case you can just pass that in, so you can save the browser the layout / repaint
  work: `{ width: <number>, height: <number>}`. This could be useful if you're
  animating the container's size, and you already know the container's size on
  each "tick".
- `observeResize()`: Makes the container observe resize events and readjust
  itself automatically. Passing in the {adjustOnResize: true} option has the same
  effect.
- `unobserveResize()`: Stops a container observing resize events.

---

◀️️ [Syntax](syntax.md)

▶️️ [Caveats](caveats.md)
