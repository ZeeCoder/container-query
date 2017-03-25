# CHANGELOG

## 1.2.5 (2017-03-25)

- Fixed a bug where the postcss plugin processed nodes it shouldn't have

## 1.2.4 (2017-03-20)

- Fixed a bug where initialiseAllContainers didn't trigger adjust calls on dom
load

## 1.2.3 (2017-03-03)

- Made the runtime work with an invalid config

## 1.2.2 (2017-03-02)

- Improved browser support:
    - Object.assign replacement
    - Removed forEach calls on NodeList objects
- Started works on a new demo

## 1.2.1 (2017-03-01)

- README update

## 1.2.0 (2017-02-28)

- Made "or" queries work as they do for @media queries

## 1.1.1 (2017-02-27)

- Attempt to make the readme appear on npm

## 1.1.0 (2017-02-27)

- cmin / cmax unit support

## 1.0.4 (2017-02-27)

- Fixed the aspect-ratio query
- improved the isEmptyObject tests

## 1.0.3 (2017-02-26)

- Made Jest a dev-only dependency

## 1.0.2 (2017-02-22)

- BUGFIX (#6): Fixed unitless @container queries
- Upgraded Jest from v18 to v19


## 1.0.1 (2017-02-21)

- Removed coverage/ and .babelrc from the installed package, hence making it a bit lighter.
