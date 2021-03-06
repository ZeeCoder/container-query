// polyfills for the test files, not the tested libraries.
// (Intentionally not using babel-polyfill to do this automatically, as then I
// might end up accidentally polyfilling something for the library, and therefore
// miss that it wouldn't work without the polyfill.)
// @see https://reactjs.org/docs/javascript-environment-requirements.html
import "core-js/fn/array/from";
import "core-js/fn/promise";
import "core-js/fn/set";
import "core-js/fn/map";
// Using the following to support async/await in tests.
// I'm intentionally not using babel/polyfill, as that would introduce polyfills
// the actual lib might not have, giving the false impression that something
// works while it might actually not, if you use the lib without babel-polyfill.
import "babel-regenerator-runtime";

// "Registering" test suits
import "./react/manual";
import "./react/hoc";
import "./react/non-oocss";
// Weirdly unless basic tests are the last, they throw errors in IE
import "./react/basic";
