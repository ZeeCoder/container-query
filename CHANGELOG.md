# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.3.0]

### Fixed

* Containers can now be safely nested.

## [2.2.1]

### Fixed

* postcss-container-query default `getJSON` function now only overwrites a
  previous file if there's an actual change.

## [2.2.0]

### Added

* react-container-query module
* doc updates
* various refactorings

## [2.1.0]

### Added

* [size-limit](https://github.com/ai/size-limit) for limiting bundle sizes

### Changed

* Dependency updates

### Fixed

* Missing `NodeList.forEach` #72

## [2.0.0] - 2017-09-04

### Added

* New diffing algorithm, which keeps track of the container's status (which
  query was applied already) and applies / removes the least amount of new styles
  possible.
* r-units produce a value with limited precision. This is 2 by default, which
  can be changed in the Container options as `valuePrecision`.
* `singleContainer` option (true by default), which makes the use of
  `@define-container` unnecessary for single-file containers. (Works well with
  Component-based architecture.)
* Support for using r-units with css custom props. ie: `--rw: 1rw;`

### Changed

* Published the runtime and the postcss plugin separately, both of which reside
  in the same monorepo. (Thanks to [Lerna](https://github.com/lerna/lerna))
* Container instances are auto-adjusting themselves on size change by default.
  (`adjustOnResize` option.)
* Bundling with Rollup instead of just transpiling the source. This gives better
  control over what is exposed, makes it easy to support other module formats in
  the future, and integrates Babel seemlessly.

### Removed

* Removed support for the container and css unit combinations - like chpx - in
  favour of rw/rh/rmin/rmax units.
* Removed `initialiseAllContainers`. It'll be turned to a demo instead in the
  future.
* Removed some of the limitation on r-units. Paddings, for example can now use
  them.

## [1.3.0] - 2017-06-07

### Added

* Resize Observer can be enabled (will be the default behaviour in 2.0.0)
* Resize observation can be switched on / off.
* First adjustment on Container instantiation can be switched off

### Changed

* Dependency upgrades

## [1.2.6] - 2017-03-26

### Fixed

* Fixed exports for non es-6 environments

## [1.2.5] - 2017-03-25

### Fixed

* Fixed a bug where the postcss plugin processed nodes it shouldn't have

## [1.2.4] - 2017-03-20

### Fixed

* Fixed a bug where initialiseAllContainers didn't trigger adjust calls on dom
  load

## [1.2.3] - 2017-03-03

### Changed

* Made the runtime work with an invalid config

## [1.2.2] - 2017-03-02

### Changed

* Improved browser support:
  * Object.assign replacement
  * Removed forEach calls on NodeList objects

### Added

* Started working on a new demo

## [1.2.1] - 2017-03-01

### Changed

* README update

## [1.2.0] - 2017-02-28

### Added

* Made "or" queries work as they do for @media queries

## [1.1.1] - 2017-02-27

### Fixed

* Attempt to make the readme appear on npm

## [1.1.0] - 2017-02-27

### Added

* cmin / cmax unit support

## [1.0.4] - 2017-02-27

### Fixed

* Fixed the aspect-ratio query

### Changed

* improved the isEmptyObject tests

## [1.0.3] - 2017-02-26

### Changed

* Made Jest a dev-only dependency

## [1.0.2] - 2017-02-22

### Fixed

* BUGFIX (#6): Fixed unitless @container queries

### Changed

* Upgraded Jest from v18 to v19

## [1.0.1] - 2017-02-21

### Removed

* Removed coverage/ and .babelrc from the installed package, hence making it a
  bit lighter.
