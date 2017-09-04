# Getting Started

This solution consists of a PostCSS plugin and a JS (`Container`) class.
> PostCSS plugin → JSON → Runtime

The plugin analyses the your CSS and extracts all container query related
data, producing a JSON file.

Depending on your setup (Gulp / webpack, etc) this file may or may not contain
more than one container's data.

(See [Multiple Containers](multiple-containers.md) for more details.)

For each containers you have in your app, you'll need to instantiate a new
`Container` with the extracted css stats.

Once you've done that, the runtime will take care of the rest.

It's important to note that selectors are expected to be the unique identifiers
of your containers, which comes naturally if you're using Components.

(To easily achieve this, I highly recommend using the BEM methodology or
something similar.)

Support for [CSS Modules](https://github.com/css-modules/css-modules#user-content-implementations)
and [CSS-in-JS](https://github.com/MicheleBertoli/css-in-js#user-content-features)
is planned, to automate this pattern.

(You might want to watch Mark Dalgleish's talk called
"[A Unified Styling Language](https://www.youtube.com/watch?v=X_uTCnaRe94)" to
have an idea why the latter might be a good thing.)

**Next:** [Usage with Webpack and React](webpack-and-react.md)
