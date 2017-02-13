
# Runtime JS
- Think of a better unit for container values (instead of ch/cw)
- support "or" in queries
- address potential issues with dynamically added / removed elements (MutationObserver?)
- think about circular issues
- remove jQuery dependency
- optimize the condition functions by pre-defining and reusing them

# PostCSS Plugin
- extra plugin to lift out @container queries from nested selectors 
- extract and test the condition => conditionFunction transformation
- handle if the getJSON option is not a function, and have a default
- handle issues where a @container declaration has no defined-container
- in "queries", the first element must not have a condition function
(this is the "base" which contains all possible changes, and the default values)

# ETC
- move utils_constants back to the utils module
- reactify? make it possible to adjust a container configuration to a given React
Component by using refs

# readme notes
- lib/* is not considered to be a part of the public API, and hence breaking
change can be introduced in any release. (even patch)
- a container can have more than one instance of its elements
- container units inside @media queries are ignored by design. The whole point
of using container queries is to remove all dependency from the viewport, and
instead use the container's dimensions
- A container cannot use container units for it's width / height properties.
This is to avoid circular issues.
- @define-container declarations will be ignored inside @container declarations
