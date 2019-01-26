# CSS-in-JS

**This is not a "CSS-in-JS" library.**

The sole purpose of this solution is to allow you to conditionally apply styles
to child elements, inside a containing element.

You can still use your regular CSS processing tool - be that PostCSS, SASS or LESS -
to process your CSS files, and when certain styles are tied to a @container query
with a certain condition, then it's the JS runtime that'll decide when to apply
your them to the applicable elements.

## Does it work with CSS-in-JS libraries?

As I'm not using any of those libraries, I'm not exactly sure how the setup would
look like, but it's quite possible to apply your regular / static styles with your
library of choice, and then use the [meta builder](https://github.com/ZeeCoder/container-query/tree/master/packages/container-query-meta-builder)
to build the meta object containing the styles that need to be applied runtime.

Feeding such a meta object to the runtime is already what we're doing, the only
difference being that this meta object is being conveniently generated for us by
the [postcss-plugin](https://github.com/ZeeCoder/container-query/tree/master/packages/postcss-container-query).

Looking into the tests for the meta builder might help you figure out how exactly
this could be implemented.

Don't hesitate to post in [issues](https://github.com/ZeeCoder/container-query/issues)
if you feel like you have a good solution!
