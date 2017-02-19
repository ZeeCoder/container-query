# Runtime JS
- Think of a better unit for container values (instead of ch/cw)
- support "or" in queries
- think about circular issues
- optionally detect container resizing (polling solution?)

# PostCSS Plugin
- remove processed nodes
- support float container values
- allow for nested @container queries, like it's with @media queries in other preprocessors 
- handle if the getJSON option is not a function, and have a default
- support units that translates to non px. (opacity, rgb, %, em-units, etc)
- make the plugin more foolproof. It should warn about potential typos / issues

# ETC
- break down things to milestones
- have a solution for sass / less
- reactify? make it possible to adjust a container configuration to a given React
Component by using refs
- function to initialise all containers found in the current page
- option to save all container configurations in separate JSON files in a dir

# readme notes
- short description, also in package.json
- lib/* is not considered to be a part of the public API, and hence breaking
change can be introduced in any release. (even patch)
- a container can have more than one instance of its elements
- the container units are relative to the container's "inner" height / width, so without the borders.
- A container cannot use container units for it's width / height properties.
This is to avoid circular issues.
- @define-container declarations will be ignored inside @container declarations
