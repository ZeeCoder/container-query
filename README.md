# Container Query

[![npm version](https://badge.fury.io/js/%40zeecoder%2Fcontainer-query.svg)](https://npmjs.com/package/@zeecoder/container-query)
[![build](https://travis-ci.org/ZeeCoder/container-query.svg?branch=master)](https://travis-ci.org/ZeeCoder/container-query)
[![Coverage Status](https://coveralls.io/repos/github/ZeeCoder/container-query/badge.svg?branch=master)](https://coveralls.io/github/ZeeCoder/container-query?branch=master)
[![Greenkeeper badge](https://badges.greenkeeper.io/ZeeCoder/container-query.svg)](https://greenkeeper.io/)

A PostCSS plugin and Javascript runtime combination, which allows you to write
**container queries** in your CSS the same way you would write **media queries**.

## Installation

`yarn add --dev @zeecoder/postcss-container-query @zeecoder/container-query`

or

`npm install --save-dev @zeecoder/postcss-container-query @zeecoder/container-query`

## @todo
- document multiple containers in a single file (singleContainer: false)

## Introduction

The way it works:

> CSS → PostCSS plugin → JSON → Runtime

Container queries work the same way media queriesdo: they allow you to apply
styles to elements (and their descendants) when certain conditions are met.

While media queries are relative to the viewport's size, container queries are
relative to a container element's size.

**What is a container?**

A container is just an HTML element, which may contain other elements.
You may want to think of them as "**Blocks**" ([BEM](http://getbem.com/naming/))
or "**Components**" ([React](https://facebook.github.io/react/docs/components-and-props.html)).

### Highlights

- Built with webpack / React in mind, but can be used with legacy projects too.
- Uses a [ResizeObserver polyfill](https://github.com/que-etc/resize-observer-polyfill)
to detect size changes. Once the [spec](https://wicg.github.io/ResizeObserver/)
is implemented by browsers, it's going to be [even more performant](https://developers.google.com/web/updates/2016/10/resizeobserver#out_now).
- Uses media query like syntax: `@container (...) { /* ... */ }`
- Supports container units: rh, rw, rmin, rmax. (Useful to set font-size
and other properties to a value that's changing with the container's size.)
- Diffing algorithm which applies / removes only the necessary styles when a
change occurs.

### Usage

```scss
.User {
    @define-container;
    // All container queries and container units must be preceded by a container
    // definition. The rest of the classes generated here are expected to be
    // "descendants" of the container.
    background: red;
    
    @container (width >= 200px) and (height >= 200px) {
        // Container queries are relative to the previous @defined-container.
        background: green;
    }
    
    &__name {
        font-size: 10rh;
        // The above is a container unit.
        // It resolves to 10 percent of the container's height in pixels.
        // (Resolves to 12px, if the container's height is 120px.)
    }
    
    &__avatar {
        display: none;

        @container (width >= 200px) and (height >= 200px) {
            display: block;
        }
    }
}
```

```html
<!--
    The container (User) elements must reside within its boundaries.
    Elements outside of a container will not be adjusted to its size.
-->
<div class="User">
    <div class="User__name"></div>
    <img class="User__avatar">
</div>

<!--
    Each instance will readjust itself to the container's size independently.
-->
<div class="User">
    <div class="User__name"></div>
    <img class="User__avatar">
</div>
```

## Documentation

- [Getting Started](docs/getting-started.md)
- [Usage with Gulp](docs/gulp.md)
- [Usage without webpack](docs/without-webpack.md)
- [Syntax](docs/syntax.md)
- [API](docs/api.md)
- [Usage with CSS Preprocessors](docs/css-preprocessors.md)

### Browser Support

@todo add exact versions

Works with all modern browsers and IE9+

## Caveats / Notes

Some things to consider when using this library.

- Resize Observer reacts in ~20ms. Should be good for animation even, but if not,
it can be switched off to use requestAnimationFrame() instead. Also: the more
you nest containers, the slower change propagates from top to bottom. This is
due to the fact that a container's size cannot be checked without having a
layout / repaint first.
- Styles are applied with the `Element.style.setProperty` method by default.
This logic will be configurable in the future (#50) which will allow for
different approaches, like  [Styletron](https://github.com/rtsao/styletron).
- With element / container query solutions, circularity issues may arise. While
[an attempt](https://github.com/ZeeCoder/container-query/issues/20) to tackle
this was made, the same is still unfortunately true to this library as well.
Use your best judgement when setting up queries / units to avoid these issues.

## Thoughts on design

In case you're wondering about the tool's design, here is a list of goals I
started with:

- Should be tested.
- Use containers instead of elements.
- Use media query syntax so that it's familiar and easy to use.
- Should be easy enough to use, but a transpiling step would be assumed.
- Uses PostCSS for preprocessing instead of having a JS runtime parser.
- Use JS modules, so it plays nicely with js bundlers (webpack, Browserify,
etc.) and Component-oriented UI libraries (React, Vue, etc.)
- Don't limit the tool to CSS syntax. With PostCSS, it's easy to parse custom
at-rules instead. The end result will still be valid CSS.
- Should work with component naming methodologies - like BEM or SUIT - the best.

## Next up

[Ideas for enhancement](https://goo.gl/7XtjDe)

## Alternatives

Finally, if you like the idea of container queries, but are not particularly
convinced by this solution, then I encourage you to look at these alternatives:

- [EQCSS](https://github.com/eqcss/eqcss)
- [CQ Prolyfill](https://github.com/ausi/cq-prolyfill)
- [React Container Query](https://github.com/d6u/react-container-query)
- [CSS Element Queries](https://github.com/marcj/css-element-queries)

## License

MIT
