# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [3.0.1]

- readme updates

## [3.0.0]

### Fixed

- Tests now check if custom props are properly set.
- Change sets are tested with hyphenated prop names instead of camel cased ones.
- `container-query`
  - Value precision is now consistent across browsers. (Instead of chrome
    applying 1px and firefox 1.00px for example.)

### Added

- Testing in Node 10
- Integration tests, supported by SauceLabs
- `postcss-container-query`
  - [Parcel bundler](https://github.com/parcel-bundler/parcel) support.
    Re-running the plugin on the same file is now safe. (The Parcel bundler reruns
    the same plugins over the same css file multiple times.)

### Removed

- "test" script is now only in the root, instead of in every package.
- **[BREAKING]** No longer testing for Node 7 and 6 (dom-testing-library needs 8
  and up, and the real targets are the browsers anyway.)
- **[BREAKING]** Removed test running from Node 6
- `react-container-query`
  - **[BREAKING]** Removed the "render" prop from ContainerQuery in favour of
    using children. (The former was not documented anyway.)
  - **[BREAKING]** Removed the `ResizeObserver` component in favour of the
    [react-resize-observer](https://github.com/ZeeCoder/react-resize-observer) and
    [use-resize-observer](https://github.com/ZeeCoder/use-resize-observer) packages.
  - **[BREAKING]** Removed the default export. (Both ContainerQuery and withContainerQuery
    is still available as named exports.)
  - **[BREAKING]** Removed the `stats` prop from ContainerQuery. (Always use
    `meta` instead.)

### Changed

- Removed unnecessary files from the packages.
- `container-query-meta-builder`
  - Removed the engines field package.json field.
  - **[BREAKING]** Removed the UMD build.
- `postcss-container-query`
  - **[BREAKING]** Minimum tested version lifted to v8. (The engines field still
    allows for v6.)
  - **[BREAKING]** Dropped the `getJSON` option, and no json is saved by default.
    The new behaviour is to use the ICSS `:export` syntax, which then can be
    imported through css-loader. (The meta object is still passed down in the
    postcss plugin messages in case it's needed.)
  - **[BREAKING]** Removed `saveMeta`.
  - **[BREAKING]** Moved `getMetadataFromMessages` from root to the lib/ folder.
- `react-container-query`
  - `ContainerQuery` no longer returns with a "null" size object when a function
    is passed in as the children prop. Instead it returns with `{width: 0, height: 0}`
    initially, then updates with the observed container element.
  - **[BREAKING]** `ContainerQuery` now renders a div root node by default, inside
    of which it renders all children. (Also accepts an `as` prop to change the
    tag type.)
  - **[BREAKING]** ContainerQuery no longer returns an object for size, but width
    and height as the first parameter of the child function
  - **[BREAKING]** ContainerQuery now returns 1x1 dimensions before the ResizeObserver
    kicks in
- `container-query`
  - **[BREAKING]** Set the pixel precision to be 0, so that whole numbers are
    applied by default.

## [3.0.0-alpha.3]

### Added

- Integration tests, supported by SauceLabs
- `postcss-container-query`
  - [Parcel bundler](https://github.com/parcel-bundler/parcel) support.
    Re-running the plugin on the same file is now safe. (The Parcel bundler reruns
    the same plugins over the same css file multiple times.)

### Changed

- Removed unnecessary files from the packages
- `react-container-query`
  - **[BREAKING]** ContainerQuery no longer returns an object for size, but width
    and height as the first parameter of the child function
  - **[BREAKING]** ContainerQuery now returns 1x1 dimensions before the ResizeObserver
    kicks in
- `container-query`
  - **[BREAKING]** Set the pixel precision to be 0, so that whole numbers are
    applied by default.

### Removed

- **[BREAKING]** Removed test running from Node 6

### Fixed

- `container-query`
  - Value precision is now consistent across browsers. (Instead of chrome
    applying 1px and firefox 1.00px for example.)

## [3.0.0-alpha.2]

### Removed

- `react-container-query`
  - **[BREAKING]** Removed the "render" prop from ContainerQuery in favour of
    using children. (The former was not even documented.)
  - **[BREAKING]** Removed the `ResizeObserver` component in favour of the
    [react-resize-observer](https://github.com/ZeeCoder/react-resize-observer) and
    [use-resize-observer](https://github.com/ZeeCoder/use-resize-observer) packages.
  - **[BREAKING]** Removed the default export. (Both ContainerQuery and withContainerQuery
    is still available as named exports.)
  - **[BREAKING]** Removed the `stats` prop from ContainerQuery. (Use `meta` instead.)

### Changed

- `react-container-query`
  - `ContainerQuery` no longer returns with a "null" size object when a function
    is passed in as the children prop. Instead it returns with `{width: 0, height: 0}`
    initially, then updates with the observed container element.
  - **[BREAKING]** `ContainerQuery` now renders a div root node by default, inside
    of which it renders all children. (Also accepts an `as` prop to change the
    tag type.)

## [3.0.0-alpha.1]

### Fixed

- Tests now check if custom props are properly set
- Change sets are tested with hyphenated prop names instead of camel cased ones

## [3.0.0-alpha.0]

### Added

- Testing in Node 10

### Removed

- "test" script is now only in the root, instead of in every package.
- **[BREAKING]** No longer testing for Node 7

### Changed

- `container-query-meta-builder`

  - Removed the engines field package.json field
  - **[BREAKING]** Removed the UMD build

- `postcss-container-query`
  - **[BREAKING]** Minimum Node version lifted to v8
  - **[BREAKING]** Dropped the `getJSON` option, and no json is saved by default.
    The new behaviour is to use the ICSS `:export` syntax, which then can be
    imported through css-loader. (The meta object is still passed down in the
    postcss plugin messages in case it's needed.)
  - **[BREAKING]** `saveMeta` is removed

## [2.7.4]

### Fixed

- `container-query-meta-builder`
  - Removed a forgotten import

## [2.7.3]

### Fixed

- `container-query-meta-builder`
  - Removed lodash

## [2.7.2]

### Fixed

- `postcss-container-query`
  - Made `saveMeta` and `getMetadataFromMessages` available for imports

## [2.7.1]

### Fixed

- Exluded some irrelevant paths from test coverage

- `postcss-container-query`
  - `watch:build` package script to help development
  - testing build files
  - Fixed exports (#90)

## [2.7.0]

### Added

- `postcss-container-query`
  - Now uses messages to provide the metadata.
  - `getMetadataFromMessages` to help extracting metadata from an array of messages
  - `saveMeta` function to save the extracted metadata alongside the CSS file

### Deprecated

- `postcss-container-query`
  - `getJSON` will be removed, in favour of `getMetadataFromMessages` and `saveMeta`

## [2.6.0]

### Added

- `postcss-container-query`
  - made the metadata file much smaller
- `container-query`
  - accepts the new meta object
- `react-container-query`
  - `ContainerQuery` accepts `meta` alongside `stats`.

### Deprecated

- `react-container-query`
  - `ContainerQuery` won't accept`stats` in the future, only `meta`.

## [2.5.0]

### Added

- `react-container-query`
  - `ContainerQuery` now accepts the render function through the `children` prop
  - `ResizeObserver` does the same

### Fixed

- `react-container-query`
  - dependency updates
  - rollup build update
- `container-query`
  - dependency updates
  - rollup build update
- `postcss-container-query`
  - dependency updates
  - rollup build update

## [2.4.2]

### Fixed

- `react-container-query`
  - `ContainerQuery` no longer tries to set state for an unmounting component

## [2.4.1]

### Fixed

- `postcss-container-query`
  - Build is now transpiled down to es5

## [2.4.0]

### Added

- `react-container-query`
  - New `ContainerQuery` and `ResizeObserver` components

## [2.3.1]

### Fixed

- `container-query`
  - `Node.forEach` is no longer globally polyfilled. (using a simple for loop
    instead internally)

## [2.3.0]

### Fixed

- Containers can now be safely nested. (Container Boundaries)

## [2.2.1]

### Fixed

- postcss-container-query default `getJSON` function now only overwrites a
  previous file if there's an actual change.

## [2.2.0]

### Added

- react-container-query module
- doc updates
- various refactorings

## [2.1.0]

### Added

- [size-limit](https://github.com/ai/size-limit) for limiting bundle sizes

### Changed

- Dependency updates

### Fixed

- Missing `NodeList.forEach` #72

## [2.0.0] - 2017-09-04

### Added

- New diffing algorithm, which keeps track of the container's status (which
  query was applied already) and applies / removes the least amount of new styles
  possible.
- r-units produce a value with limited precision. This is 2 by default, which
  can be changed in the Container options as `valuePrecision`.
- `singleContainer` option (true by default), which makes the use of
  `@define-container` unnecessary for single-file containers. (Works well with
  Component-based architecture.)
- Support for using r-units with css custom props. ie: `--rw: 1rw;`

### Changed

- Published the runtime and the postcss plugin separately, both of which reside
  in the same monorepo. (Thanks to [Lerna](https://github.com/lerna/lerna))
- Container instances are auto-adjusting themselves on size change by default.
  (`adjustOnResize` option.)
- Bundling with Rollup instead of just transpiling the source. This gives better
  control over what is exposed, makes it easy to support other module formats in
  the future, and integrates Babel seemlessly.

### Removed

- Removed support for the container and css unit combinations - like chpx - in
  favour of rw/rh/rmin/rmax units.
- Removed `initialiseAllContainers`. It'll be turned to a demo instead in the
  future.
- Removed some of the limitation on r-units. Paddings, for example can now use
  them.

## [1.3.0] - 2017-06-07

### Added

- Resize Observer can be enabled (will be the default behaviour in 2.0.0)
- Resize observation can be switched on / off.
- First adjustment on Container instantiation can be switched off

### Changed

- Dependency upgrades

## [1.2.6] - 2017-03-26

### Fixed

- Fixed exports for non es-6 environments

## [1.2.5] - 2017-03-25

### Fixed

- Fixed a bug where the postcss plugin processed nodes it shouldn't have

## [1.2.4] - 2017-03-20

### Fixed

- Fixed a bug where initialiseAllContainers didn't trigger adjust calls on dom
  load

## [1.2.3] - 2017-03-03

### Changed

- Made the runtime work with an invalid config

## [1.2.2] - 2017-03-02

### Changed

- Improved browser support:
  - Object.assign replacement
  - Removed forEach calls on NodeList objects

### Added

- Started working on a new demo

## [1.2.1] - 2017-03-01

### Changed

- README update

## [1.2.0] - 2017-02-28

### Added

- Made "or" queries work as they do for @media queries

## [1.1.1] - 2017-02-27

### Fixed

- Attempt to make the readme appear on npm

## [1.1.0] - 2017-02-27

### Added

- cmin / cmax unit support

## [1.0.4] - 2017-02-27

### Fixed

- Fixed the aspect-ratio query

### Changed

- improved the isEmptyObject tests

## [1.0.3] - 2017-02-26

### Changed

- Made Jest a dev-only dependency

## [1.0.2] - 2017-02-22

### Fixed

- BUGFIX (#6): Fixed unitless @container queries

### Changed

- Upgraded Jest from v18 to v19

## [1.0.1] - 2017-02-21

### Removed

- Removed coverage/ and .babelrc from the installed package, hence making it a
  bit lighter.
