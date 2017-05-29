# Container Query

[![npm version](https://badge.fury.io/js/%40zeecoder%2Fcontainer-query.svg)](https://npmjs.com/package/@zeecoder/container-query)
[![build](https://travis-ci.org/ZeeCoder/container-query.svg?branch=master)](https://travis-ci.org/ZeeCoder/container-query)
[![Coverage Status](https://coveralls.io/repos/github/ZeeCoder/container-query/badge.svg?branch=master)](https://coveralls.io/github/ZeeCoder/container-query?branch=master)
[![Greenkeeper badge](https://badges.greenkeeper.io/ZeeCoder/container-query.svg)](https://greenkeeper.io/)

A PostCSS plugin and Javascript runtime combination, which allows you to write
**container queries** in your CSS the same way you would write **media queries**.

## Installation

`yarn add --dev @zeecoder/container-query`

or

`npm install --save-dev @zeecoder/container-query`

## Introduction

The way it works:

> PostCSS plugin => JSON => Runtime

Container queries work the same way media queriesdo: they allow you to apply
styles to elements (and their descendants) when certain conditions are met.

While media queries are relative to the viewport's size, container queries are
relative to a container element's size.

**What is a container?**

A container is just an HTML element, which may contain other elements.
You may want to think of them as "**Blocks**" ([BEM](http://getbem.com/naming/))
or "**Components**" ([React](https://facebook.github.io/react/docs/components-and-props.html)).

### Highlights

- Built with webpack / React in mind
- Uses a [ResizeObserver polyfill](https://github.com/que-etc/resize-observer-polyfill)
to detect size changes. Once the [spec](https://wicg.github.io/ResizeObserver/)
is implemented by browsers, it's going to be [even more performant](https://developers.google.com/web/updates/2016/10/resizeobserver#out_now).
- Uses media query like syntax: `@container (...) { /* ... */ }`
- Supports container units: chpx, cwpx, cminpx, cmaxpx. (Useful to set font-size
and other properties to a value that's changing with the container's size.)

### Browser Support

Works with all modern browsers and IE9+

### In action

```pcss
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
        font-size: 10chpx;
        // The above is a container unit.
        // It resolves to 10 percent of the container's height in pixels.
        // Resolves to 12px, if the container's height is 120px.
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

## How to use

This solution consists of a PostCSS plugin and a JS (`Container`) class.

> PostCSS plugin => JSON => Runtime

The plugin analyses the given CSS, and extracts all container-query related
lines, producing a JSON file. Depending on your setup (Gulp / webpack, etc)
this file may or may not contain more than one container's data.

Once the JSON file is generated, a new Container instance needs to be created
for all container HTML Elements, with the right json stats.

### JSON structure

```json
{
  ".User": {},
  ".Post": {},
  ".Avatar": {}
}
```

As you can see, selectors are considered to be the unique identifiers of
defined containers. While technically nothing will stop you from having
`.page .container .User` as a container's selector, it is *not recommended*.

Instead, use the BEM methodology or something similar.

Support for [CSS Modules](https://github.com/css-modules/css-modules#user-content-implementations)
and [CSS-in-JS](https://github.com/MicheleBertoli/css-in-js#user-content-features)
is planned, to automate this pattern.

(You might want to watch Mark Dalgleish's talk called
"[A Unified Styling Language](https://www.youtube.com/watch?v=X_uTCnaRe94)" to
have an idea why the latter might be a good thing.)

### webpack + React

I recommend you to set up [postcss-loader](https://github.com/postcss/postcss-loader)
with [postcss-nested](https://github.com/postcss/postcss-nested) with
`bubble: ['container']` option, or to use SASS.

**Avatar.pcss**
```pcss
.Avatar {
    @define-container;
    /* ... */
    
    @container (aspect-ratio: > 3) {
        /* ... */
    }
    
    @container (width > 100px) and (height > 100px) {
        /* ... */
    }
}
```

**Avatar.js**
```js
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Container from "@zeecoder/container-query/Container";

// Generates `Avatar.json` in the same folder.
require('./Avatar.pcss');
// We only defined the Avatar container in the pcss file, so there's nothing
// else there apart from the '.Avatar' property. 
const containerStats = require('./Avatar.json')['.Avatar'];
// `['.Avatar']` will be unnecessary once Issue#17 is done

export default class Avatar extends Component {
    componentDidMount() {
        new Container(
            ReactDOM.findDOMNode(this),
            containerStats,
            {adjustOnResize: true}
        );
        // adjustOnResize will be the default behaviour in 2.0
    }

    render() {
        return (
            <div className="Avatar"></div>
        );
    }
}
```

**And that's it!**

Now all new *Avatar* components will automatically adjust to the component's size.

### Gulp setup

If you're not a fan of processing styles with webpack, then you can use a task
runner instead, like Gulp.

Your task could look something like this:

```js
const gulp = require('gulp');
const postcss = require('gulp-postcss');
const rename = require('gulp-rename');
const postcssImport = require('postcss-import');
const postcssNested = require('postcss-nested');
const containerQuery = require('@zeecoder/container-query/containerQuery');

gulp.task('styles', () => {
    return gulp.src('styles/main.pcss')
        .pipe(postcss([
            postcssImport(),
            postcssNested({ bubble: ['container'] }),
            containerQuery(),
        ]))
        .pipe(rename('main.css'))
        .pipe(gulp.dest('web/dist'));
});

```

Now you'll have both main.css and main.json. The CSS can then be served separately
from the JS, while webpack could still `require()` the JSON and do its thing. 

### Without webpack

Even though the library was made with webpack in mind, there's no reason why
other bundlers wouldn't work, or other UI libraries for that matter. (Instead
of React.)

**Just follow the same steps**

1) Process your styles with the PostCSS plugin, to extract all container-related
information
2) Save the JSON(s) somewhere
3) Serve the JSON(s) to the JS some way
4) Create a Container instance for all container html elements

For instance, imagine you have a main.pcss file, which imports all other
components.(Using Gulp as described above.)

Then, you can serve the JSON from the backend, and bundle the JS with your
favourite JS bundler, to grab that JSON and instantiate the Container class for
all elements found:

```js
// Assumptions:
// Browserify as the bundler
// JSON is available in a script tag, served by the backend:
// `<script type="application/json" id="container-stats">{ ... }</script>`

import Container from "@zeecoder/container-query/Container";

const containerStats = JSON.parse(
    document.getElementById('container-stats').innerHTML
);

// Initialising all containers by finding all instances based on the selectors
for (let containerSelector in containerStats) {
    document.querySelectorAll(containerSelector).forEach(element => {
        // Initialising all HTML Elements with the right json stats
        new Container(
            element,
            containerStats[containerSelector],
            {adjustOnResize: true}
        );
    });
}
```

The above doesn't cover dynamically created elements, but you get the idea.

## Syntax

### Declaration

As previous examples show, containers can be declared by adding
`@define-container;` inside a rule that's meant to be used as a container.

Multiple such definitions in a single CSS file are allowed. All container
queries and units will be relative to the previous declaration.

Like so:

```pcss
.User {
    @define-container;
    
    &__name {
        display: none;
        font-size: 10chpx;
    }
    
    @container (width > 200px) {
        display: block;
    }
}

.Avatar {
    @define-container;
    
    border-radius: 100%;
    border: 1chpx solid;
    
    @container (width < 30px), (height < 30px) {
        background: grey;
    }
}
```

Note that for container queries and container units to work, all elements must
be descendants of the container.

Using the above example, an element with the `.User__name` class will not have
its font-size adjusted, unless it's a descendant of a container element with
the `.User` class.

### Queries

Container queries have the same syntax media queries do:

```pcss
@container (condition) and (condition), (condition) {
    // styles
}
```

However, instead of writing min-width, min-height you can use the following
operators: `<`, `<=`, `>`, `>=`.

(In accordance width [CSS Media Queries Level 4](https://drafts.csswg.org/mediaqueries/#mq-range-context))

The following conditions are supported: width, height, aspect-ratio, orientation.

**Examples**

```pcss
@condition (orientation: landscape) {}
@condition (orientation: portrait) {}
@condition (width > 100px) {}
@condition (height < 100px) {}
@condition (aspect-ratio > 3) {}
@condition (orientation: landscape) and (aspect-ratio > 3) {}
```

If you want the same syntax for your media queries, then I recommend [this plugin](https://github.com/postcss/postcss-media-minmax).

### Units

Container units are like viewport units (vh, vw, vmin and vmax), only relative
to the container. They are useful to generate values based on the container's
size.

The supported units are: **chpx**, **cwpx**, **cminpx**, **cmaxpx**.

**Syntax**: `<value><ch/cw>px`

Depending on whether ch or cw is used, value stands for a percentage of the
container's width or height.

If a container's size is:

- width: 120px
- height: 130px

then

- 100cwpx => 120px
- 100chpx => 130px
- 100cminpx => 120px
- 100cmaxpx => 130px
- 15chpx => 11.53846px
- 15cwpx => 12.5px

And so on.

**Example**

```pcss
.User {
    @define-container;
    
    &__name {
        font-size: 10chpx;
    }
    
    &__avatar {
        border-radius: 100%;
        border: 1vminpx solid;
    }
    
    @container (height > 150px) {
        font-size: 15chpx;
        border: 5vminpx solid;
    }
}
```

Technically, you can produce any CSS units, like: chem/cwem/cminem/cmaxem,
chrem/cwrem/cminrem/cmaxrem), but they're planned to be [phased out](https://github.com/ZeeCoder/container-query/issues/16).

Also note that recalculating and applying these values is costly, since it's
done on each resize event (or `adjust` call).

**Example**

You might be tempted to use container units to set an aspect ratio between the
container's width / height:

```pcss
.Container {
    @define-container;
    height: 50cwpx;
    // Height will now be 50% of it's width
}
```

While this works, there's a [pure CSS solution too](https://codepen.io/ZeeCaptein/pen/ZyEowo).

Admittedly more boilerplate, but it might worth avoiding JS when it's not really
necessary by using flexbox, CSS grid and other vanilla CSS solutions instead.

## API

### Container (Runtime)

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

### containerQuery (PostCSS plugin)

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

## Compatibility with other CSS preprocessors

From the examples above, you can see that I recommend using PostCSS.
However, other css preprocessors would work too, as long as they support custom
at-rules.

### SASS

Sass works out of the box with at-rules, even when they're nested.

They behave the same way media queries, which is great!

You can write things like:

```pcss
.Avatar {
    @define-container;
    /* ... */
    
    @container (width > 200px) {
        /* ... */
    }
    
    @container (height > 200px) {
        /* ... */
    }
}
```

Which compiles to:

```css
.Avatar {
    @define-container;
    /* ... */
}

@container (width > 200px) {
    .Avatar {
        /* ... */
    }
}

@container (height > 200px) {
    .Avatar {
        /* ... */
    }
}
```

### LESS

Support for at-rules is limited, but it'll work fine with v2.6.0 and above as
long as you avoid nesting.

## Caveats / Notes

There are some things to look out for when using this library.

- Resize Observer reacts in ~20ms. Should be good for animation even, but if not,
it can be switched off to use requestAnimationFrame() instead. Also: the more
you nest containers, the slower change propagates from top to bottom. This is
due to the fact that a container's size cannot be checked without having a
layout / repaint first.
- Currently, styles are applied through the Element.style object. I'll probably
replace this mechanic with [Styletron](https://github.com/rtsao/styletron), or
something similar in the future.
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
- [CSS Element Queries](https://github.com/marcj/css-element-queries)
- [CQ Prolyfill](https://github.com/ausi/cq-prolyfill)
- [React Container Query](https://github.com/d6u/react-container-query)
