# How to Contribute

This project uses [Lerna](https://lernajs.io/) to manage its packages.

## Getting Started

I recommend [yarn](http://yarnpkg.com) for development.

- Run `yarn`
- Run `yarn bootstrap` (This will install all dependencies, build the packages
  and links any cross-dependencies. It also allows packages to import each other
  using their published package names.)
- Run `yarn test:unit` to run the unit tests.
- Run `yarn test:packages` to run the "test" scripts inside all packages.
- Run `yarn test:integration:build` to build the integration test files.
- Run `yarn test:integration` to run the integration tests in headless Chrome.

## Testing

Unit tests are using [Jest](https://jestjs.io/), while integration tests are using
[Karma](https://karma-runner.github.io). (And [Sauce Labs](https://saucelabs.com/)
in the CI to run in multiple browsers.)

During development, you can run:

- `yarn test:unit:watch` and,
- `KARMA_CHROME=true yarn test:integration --singleRun=false`

to run the tests on code changes.

Note that you'll also need to run the build in watch mode in the package you're
working on, as integration tests use the built code.)
