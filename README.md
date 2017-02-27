# Container Query

[![npm version](https://badge.fury.io/js/%40zeecoder%2Fcontainer-query.svg)](https://npmjs.com/package/@zeecoder/container-query)
[![build](https://travis-ci.org/ZeeCoder/container-query.svg?branch=master)](https://travis-ci.org/ZeeCoder/container-query)
[![Code Climate](https://codeclimate.com/github/ZeeCoder/container-query/badges/gpa.svg)](https://codeclimate.com/github/ZeeCoder/container-query)
[![Coverage Status](https://coveralls.io/repos/github/ZeeCoder/container-query/badge.svg?branch=master)](https://coveralls.io/github/ZeeCoder/container-query?branch=master)

A PostCSS plugin and Javascript runtime combination, which allows you to write
@container queries in your CSS the same way you would write @media queries.

## PublicAPI
- `Container.js` - JS Runtime
- `containerQuery.js` - PostCSS Plugin
- `initialiseAllContainers.js` - helper function

The rest is not considered to be a part of the Public API, which means they can
change at any time. (Including minor / patch releases.)

## Limitations
- No "or" for @container queries right now, so this is not possible:
`@container ( ... ) or ( ... ) { ... }`
- `@container` queries cannot be nested
- LESS doesn't compile with the current syntax

## Notes
- Lead with ## WHAT (image) followed by ## WHY
- list supported browsers
- BEM-inspiration: Block -> inside of which are elements (unique classnames!)
- @container queries must always be preceded by a @define-container
- All @containers following a @defined-container will be related to that
- @define-container declarations will be ignored inside @container declarations
- Example function to save all container configurations in separate JSON files in a dir
- Gulp example
    - PostCSS example
    - SASS example: works out of the box
    - Less -> separate pipeline
- Containers can have more than one instance of their elements
- The container units are relative to the container's "inner" height / width.
(Without the borders.)
- Note possible circular issues
    - A container should not use container units for properties that would affect
    its width / height. These situations are not currently handled, so try to
    avoid them.
    
- To avoid circular deps, use overflow: hidden and avoid using container units on defined containers
- Use native CSS techniques to achieve your goal whenever possible (css grid, flexbox)
