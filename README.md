# Container Query

[![Greenkeeper badge](https://badges.greenkeeper.io/ZeeCoder/container-query.svg)](https://greenkeeper.io/)

[![npm version](https://badge.fury.io/js/%40zeecoder%2Fcontainer-query.svg)](https://npmjs.com/package/@zeecoder/container-query)
[![build](https://travis-ci.org/ZeeCoder/container-query.svg?branch=master)](https://travis-ci.org/ZeeCoder/container-query)
[![Code Climate](https://codeclimate.com/github/ZeeCoder/container-query/badges/gpa.svg)](https://codeclimate.com/github/ZeeCoder/container-query)
[![Coverage Status](https://coveralls.io/repos/github/ZeeCoder/container-query/badge.svg?branch=master)](https://coveralls.io/github/ZeeCoder/container-query?branch=master)

A PostCSS plugin and Javascript runtime combination, which allows you to write
@container queries in your CSS the same way you would write @media queries.

## screenshot

## How to use

### Install

`npm install --save-dev @zeecoder/container-query`

## PublicAPI
- `Container.js` - JS Runtime
- `containerQuery.js` - PostCSS Plugin
- `initialiseAllContainers.js` - helper function

The rest in build/ is not considered to be a part of the Public API, which means
anything in it can change at any time. (Including minor / patch releases.)

## Limitations
- No "or" for @container queries right now, so this is not possible:
`@container ( ... ) or ( ... ) { ... }`
- `@container` queries cannot be nested
- LESS doesn't compile with the current syntax

## Supported Browsers

- Works with all modern browsers and IE9+

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


## Thoughts on design

Here is a list of goals I started with, in case you're wondering about the
tool's design:

- Should be thoroughly unit tested
- Use containers (as opposed to "element query"),
- Resemble @media queries so that it's familiar and easy to use,
- Uses PostCSS for preprocessing instead of a JS runtime parser,
- Modular, so it plays nicely with js bundlers and "Component-based" UI
libraries (Webpack / Browserify / React etc.)
- Doesn't need to be valid CSS syntax (since it's based on PostCSS)
- Be easy enough to use, but a transpiling step in the frontend build
process would be assumed
- Should work especially well with css component naming methodologies, like BEM or SUIT 
