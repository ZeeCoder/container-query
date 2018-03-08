# Getting Started

This solution consists of a PostCSS plugin and a JS (`Container`) class.

> PostCSS plugin → Metadata → Runtime

The plugin analyses your CSS and extracts all container query related
data, producing a metadata JSON file.

Depending on your setup (Gulp / webpack, etc) this file could contain more than
one container's data.

(See [Multiple Containers](multiple-containers.md) for more details.)

For each containers you have in your app, you'll need to instantiate a new
`Container` with the extracted metadata.

Once you've done that, the runtime will take care of the rest.

**Next:** [Usage with webpack and React](webpack-and-react.md)
