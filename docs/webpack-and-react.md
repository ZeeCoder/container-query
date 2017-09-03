# Usage with webpack and React

I recommend you to set up [postcss-loader](https://github.com/postcss/postcss-loader)
with [postcss-nested](https://github.com/postcss/postcss-nested) with
`bubble: ['container']` option, or to use SASS.

**Avatar.pcss**
```pcss
.Avatar {
    /* ... */
    
    &__image {
        /* ... */
        
        @container (width > 100px) {
            /*
                Change some styles on the image element when the container is
                wider than 100px
            */
        }
    }
    
    @container (aspect-ratio: > 3) {
        /* Change styles on the avatar itself, when the aspect-ratio is grater than 3 */
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
import Container from "@zeecoder/container-query";

// `Avatar.json` gets generated in the same folder.
require('./Avatar.pcss'); 
const queryStats = require('./Avatar.json');

export default class Avatar extends Component {
    componentDidMount() {
        new Container(ReactDOM.findDOMNode(this), queryStats);
    }

    render() {
        return (
            <div className="Avatar">
                <img className="Avatar__image"/>
            </div>
        );
    }
}
```

**That's it!**

Now all new *Avatar* components will automatically adjust to the size of the
component individually.

As you can see from the example, you can affect descendants' styles too, based
on the same size changes.

**Next:** [Usage with Gulp](gulp.md)
