# Tests

Run `node --test test/*.test.js` with Node.js 24.

Generate the same Cobertura report as CI:

```sh
npx --yes c8@12.0.0 node --test test/*.test.js
```

The report is `coverage/cobertura-coverage.xml`. CI retains it as an artifact; no coverage threshold is enforced yet. `.c8rc.json` defines the measured application files and excludes test fixtures and dependencies.
