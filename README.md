# Container Query

[![npm version](https://badge.fury.io/js/z-image-preloader.svg)](http://badge.fury.io/js/z-image-preloader)
[![build](https://travis-ci.org/ZeeCoder/container-query.svg?branch=master)](https://travis-ci.org/ZeeCoder/container-query)
[![Code Climate](https://codeclimate.com/github/ZeeCoder/container-query/badges/gpa.svg)](https://codeclimate.com/github/ZeeCoder/container-query)
[![Coverage Status](https://coveralls.io/repos/github/ZeeCoder/container-query/badge.svg?branch=master)](https://coveralls.io/github/ZeeCoder/container-query?branch=master)

# Milestones

## 1.0.0
- Support float container values
- Think of a better unit for container values (instead of ch/cw)
- Short description, also in package.json
- Documented solutions for SASS / LESS and just PostCSS
- Turn all milestone notes in the README to github issues and write a proper README

## 1.1.0
- Optionally detect container resizing (polling solution?) instead of adjusting on window resize only

## 1.2.0
- Support "or" in queries

## 1.3.0
- Allow for nested @container queries, like it's with @media queries in other preprocessors

## 1.4.0
- Support units that translates to non px. (opacity, rgb, %, em-units, etc)

## 1.5.0
- Ease usage with React, by hooking into Component refs
- Webpack loader
- compatibility with CSS-modules

# README notes

- Example function to save all container configurations in separate JSON files in a dir
- lib/* is not considered to be a part of the public API, and hence breaking
change can be introduced in any release. (even patch)
- a container can have more than one instance of its elements
- the container units are relative to the container's "inner" height / width, so without the borders.
- @define-container declarations will be ignored inside @container declarations
- Note possible circular issues
    - A container cannot use container units for properties that would affect
    its width / height.
