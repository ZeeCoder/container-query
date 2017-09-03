# Container Query

[![npm version](https://badge.fury.io/js/%40zeecoder%2Fcontainer-query.svg)](https://npmjs.com/package/@zeecoder/container-query)
[![build](https://travis-ci.org/ZeeCoder/container-query.svg?branch=master)](https://travis-ci.org/ZeeCoder/container-query)
[![Coverage Status](https://coveralls.io/repos/github/ZeeCoder/container-query/badge.svg?branch=master)](https://coveralls.io/github/ZeeCoder/container-query?branch=master)
[![Greenkeeper badge](https://badges.greenkeeper.io/ZeeCoder/container-query.svg)](https://greenkeeper.io/)

A PostCSS plugin and Javascript runtime combination, which allows you to write
**container queries** in your CSS the same way you would write **media queries**.

## Introduction

Container queries work the same way media queries do: they allow you to apply
styles to elements when certain conditions are met.

While media queries are relative to the viewport's size, container queries are
relative to a container element's size.

**What is a Container?**

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

### How does it look

```pcss
// User.pcss
.User {
    background: red;
    
    @container (width >= 200px) and (height >= 200px) {
        background: green;
    }
    
    &__name {
        font-size: 10rh;
    }
    
    &__avatar {
        display: none;

        @container (width >= 200px) and (height >= 200px) {
            display: block;
        }
    }
}
```

The above example assumes **webpack**, using **BEM** naming conventions and the
**postcss-loader**.

`.User` is automatically detected to be the container (the first class in the
proccessed file), and all following container queries / units will be related
to the containing `.User` element.

The html then could look like this:

```html
<div class="User">
    <div class="User__name"></div>
    <img class="User__avatar">
</div>
```

Finally, after you create a new `Container` instance, (passing in the HTMLElement,
and the extracted css stats) everything will just work.


*Note:* A file can have multiple containers, with the [@define-container](docs/multiple-containers.md)
 declaration, but it's encouraged to have a dedicated file for each component.

## Installation

`yarn add --dev @zeecoder/postcss-container-query @zeecoder/container-query`

or

`npm install --save-dev @zeecoder/postcss-container-query @zeecoder/container-query`


## Documentation

- [Getting Started](docs/getting-started.md)
- [Usage with webpack and React](docs/webpack-and-react.md)
- [Usage with Gulp](docs/gulp.md)
- [Multiple Containers](docs/multiple-containers.md)
- [Usage without webpack](docs/without-webpack.md)
- [Syntax](docs/syntax.md)
- [API](docs/api.md)
- [Usage with CSS Preprocessors](docs/css-preprocessors.md)

### Browser Support

Works with all modern browsers and IE10+

## Caveats / Notes

- The ResizeObserver reacts in ~20ms. For the most part that should be ok, but
if you need more control over when a container applies new styles, however, you
can switch off the observing behaviour, and call the `adjust` method on the
Container instance manually, when you see fit.
- Due to the above mentioned 20ms reaction time, the more you nest containers,
the slower change propagates from top to bottom.
- Styles are applied with the `Element.style.setProperty` method by default.
This logic will probably be configurable in the future (#50) which will allow for
different approaches. (Using [Styletron](https://github.com/rtsao/styletron), for
instance.)
- With element / container query solutions, circularity issues may arise. While
[an attempt](https://github.com/ZeeCoder/container-query/issues/20) to tackle
this was made, the same is still unfortunately true to this library as well.
Use your best judgement when setting up container queries / units to avoid these
issues.

## Thoughts on design

In case you're wondering about the tool's design, here is a list of goals I
had in mind when I started:

- Should be tested,
- Should use containers instead of elements,
- Should use a media query-like syntax so that it's familiar and easy to use,
- Should be easy enough to use, but a transpiling step would be assumed,
- Should uses PostCSS for preprocessing, instead of having a runtime parser,
- Should use JS modules, so it plays nicely with bundlers (webpack, Browserify,
etc.) and Component-oriented UI libraries (React, Vue, etc.),
- Shouldn't be limited to CSS syntax. (Utilising custom at-rules for instance),
- Should work with component naming methodologies - like BEM or SUIT - the best.

## Next up

[Ideas for enhancement](https://goo.gl/7XtjDe)

## Alternatives

If you like the idea of container queries, but are not particularly
convinced by this solution, then I encourage you to look at these alternatives:

- [EQCSS](https://github.com/eqcss/eqcss)
- [CQ Prolyfill](https://github.com/ausi/cq-prolyfill)
- [React Container Query](https://github.com/d6u/react-container-query)
- [CSS Element Queries](https://github.com/marcj/css-element-queries)

## License

MIT
