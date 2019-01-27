<h1 align="center">
	<br>
	<img width="360" src="https://rawgit.com/ZeeCoder/container-query/master/media/Logo.png" alt="Container Query">
	<br>
    <br>
</h1>

[![npm version](https://badge.fury.io/js/%40zeecoder%2Fcontainer-query.svg)](https://npmjs.com/package/@zeecoder/container-query)
[![build](https://travis-ci.org/ZeeCoder/container-query.svg?branch=master)](https://travis-ci.org/ZeeCoder/container-query)
[![Coverage Status](https://coveralls.io/repos/github/ZeeCoder/container-query/badge.svg?branch=master)](https://coveralls.io/github/ZeeCoder/container-query?branch=master)
[![Greenkeeper badge](https://badges.greenkeeper.io/ZeeCoder/container-query.svg)](https://greenkeeper.io/)

![SauceLabsTestMatrix](https://app.saucelabs.com/browser-matrix/TheC0d3r.svg)

> A PostCSS plugin and Javascript runtime combination, which allows you to write
> **container queries** in your CSS the same way you would write **media queries**.

🕶 **Uses Resize Observer**: Uses the native ResizeObserver implentation when available,
and falls back to a [polyfill](https://github.com/que-etc/resize-observer-polyfill)
to detect size changes. If you use Chrome, [you can test](https://codesandbox.io/s/l3rmm1rz2l)
how performant the plugin is with the native implementation. (Shipped in v64.)

📦 **Bundler Support**: Built with bundlers in mind, like [Parcel](https://parceljs.org),
[webpack](https://webpack.js.org) and [Browserify](http://browserify.org/).

🎲 **Component Support**: Built with component-based libraries in mind, like
[React](https://reactjs.org), [Vue](https://vuejs.org/), [Ember](https://emberjs.com/)
and [Angular](https://angularjs.org/).

📄 **Intuitive Syntax**: Uses at-rules, the [same way @media queries do](docs/syntax.md#Queries):
`@container (...) { ... }`

🎉 **Container Units**: [rh, rw, rmin, rmax,](docs/syntax.md#Units) which are
relative to the container element's width and / or height. (Same way viewport
units are relative to the viewport's size.)

## Introduction

Container queries are very similar to media queries; they allow you to apply
styles to elements when certain conditions are met.

The key difference is that while media queries are relative to the viewport's
size, container queries are relative to a container element's size.

Thanks to this trait, you can have multiple instances of the same container
element, all of which changes its own- and its childrens' styles based on the
containing element's size.

**What is a Container?**

A container is just an HTML element, which may (or may not) contain other elements.

You may want to think of them as "**Components**" ([React](https://facebook.github.io/react/docs/components-and-props.html))
or "**Blocks**" ([BEM](http://getbem.com/naming/)).

## Demos

The best way to understand the concept, is if you try it for yourself.

- [Nested Components](https://codesandbox.io/s/k9n28rkkl7)
- [Social Posts](https://codesandbox.io/s/0l71yp80w)
- [Without React](https://codesandbox.io/s/mo7nr90vmj)

Note that because these demos are hosted on [CodeSandbox](https://codesandbox.io),
where webpack or PostCSS cannot ([currently](https://twitter.com/codesandbox/status/1087336337915760640))
be configured, styles are simply imported as strings and processed in the browser.
(Using [@zeecoder/cq-demo-utils](https://github.com/ZeeCoder/cq-demo-utils).)

While this works for demo purposes, in a real application it is strongly
recommended to process styles build-time, as later described in this
documentation.

## Documentation

- [Getting Started](docs/getting-started.md)
- [Parcel](docs/parcel.md)
- [webpack](docs/webpack.md)
- [Gulp](docs/gulp.md)
- [React](docs/react.md)
- [CSS Modules](docs/css-modules.md)
- [Multiple Containers](docs/multiple-containers.md)
- [Without React](docs/without-react.md)
- [CSS Preprocessors](docs/css-preprocessors.md)
- [Syntax](docs/syntax.md)
- [JS API](docs/js-api.md)
- [Caveats](docs/caveats.md)
- [CSS-in-JS](docs/css-in-js.md)

## What's Next?

[Ideas for Enhancement](https://goo.gl/7XtjDe)

## Support

Please consider supporting me if you like what I do on my
[Patreon](https://www.patreon.com/zeecoder) page.

## Thoughts on Design

In case you're wondering about the tool's design, here is a list of goals I had
in mind with the initial implementation:

- Should be tested,
- Should use containers instead of elements (As opposed to other "element-query"
  libraries.),
- Should use a media query-like syntax so that it's familiar and easy to use,
- Should uses PostCSS for preprocessing, instead of having a runtime parser,
- Should be easy enough to use, but a transpiling step would be assumed (Due to
  the reason above.),
- Should use ES modules, so it plays nicely with bundlers (Parcel, webpack
  Browserify, etc.) and with Component-oriented UI libraries (React, Vue, etc.),
- Should work best with component naming methodologies, like BEM or SUIT, but
  should also work without them.

## WICG

The WICG dived into 2018 with renewed effort to make native Container Queries
a reality in browsers.

If you're interested in how things are progressing, please feel free to visit
the following links, where the disussions are happening:

- [Slack](https://join.slack.com/t/containerqueries/shared_invite/enQtMzA2OTc5MDUwNjk1LTEwMWEzNjcwMTY1MGYzYWMyOGMxM2MzNDM1OGZjMjM3NDNiMDMxYTk0YjQxN2FjYTZkYmZkMDZmOWE1ODRkZWI)
- [Use Cases](https://github.com/WICG/cq-usecases)
- [General Discussion](https://github.com/WICG/container-queries)

## Related

- [@zeecoder/react-resize-observer](https://github.com/ZeeCoder/react-resize-observer)
- [use-resize-observer](https://github.com/ZeeCoder/use-resize-observer)

## Alternatives

If you like the idea of container queries, but are not particularly
convinced by this solution, then I encourage you to look at these alternatives:

- [EQCSS](https://github.com/eqcss/eqcss)
- [CQ Prolyfill](https://github.com/ausi/cq-prolyfill)
- [React Container Query](https://github.com/d6u/react-container-query)
- [CSS Element Queries](https://github.com/marcj/css-element-queries)

## Big Thanks

Cross-browser Testing Platform and Open Source <3 Provided by [Sauce Labs][homepage]

[homepage]: https://saucelabs.com

## License

MIT
