
# Runtime JS
- Think of a better unit for container values (instead of ch/cw)
- support "or" in queries
- address potential issues with dynamically added / removed elements (MutationObserver?)
- think about circular issues
- remove jQuery dependency
- optimize the condition functions

# PostCSS Plugin
- in "values", the first element must not have a condition function (always applied)
- this same element must have the defaultValues object
- values parsing ex: "80ch" => [0.8, "ch"]
- support shorthand values, like: `padding: 10cw 10ch`
- support default container values without @container queries

# ETC
- reactify? make it possible to adjust a container configuration to a given React Component by using refs
