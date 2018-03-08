# container-query-meta-builder

This module is part of a [monorepo](https://github.com/ZeeCoder/container-query).

## Goal

This package was created to make the process of extracting container-query metadata
from the source CSS easier, and more maintainable.

As such, it's mainly intended to be used by other packages internally, like
`postcss-container-query`, and `container-query`.

It can potentially be used as a sort of css-in-js (Alongside an existing
library you might already use.), in case you don't want to use the postcss plugin
or don't have source CSS files to process to begin with.

## Usage

The easiest way to understand how it works is by looking at the [tests](./src/test).

## License

MIT
