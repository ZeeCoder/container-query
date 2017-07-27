# Getting Started

This solution consists of a PostCSS plugin and a JS (`Container`) class→
> PostCSS plugin → JSON → Runtime

The plugin analyses the given CSS, and extracts all container-query related
lines, producing a JSON file. Depending on your setup (Gulp / webpack, etc)
this file may or may not contain more than one container's data.

Once the JSON file is generated, a new Container instance needs to be created
for all container HTML Elements, with the right json stats.

## JSON structure

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

## webpack + React

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
