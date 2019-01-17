// polyfills for the test files, not the tested libraries.
// (Intentionally not using babel-polyfill to do this automatically, as then I
// might end up accidentally polyfilling something for the library, and therefore
// miss that it wouldn't work without the polyfill.)
// todo note that for IE9/10 support, these polyfills are needed with react-container-query
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
// import "./react/basic";
// import "./react/hoc";
// import "./react/manual";
import "./react/non-oocss";
