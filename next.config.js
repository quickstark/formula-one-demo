/**
 * @type {import('next').NextConfig}
 */

// must add for ably react hooks to transpile correctely (or throws an "export error")
const withTM = require("next-transpile-modules")(["@ably-labs/react-hooks"]);

module.exports = withTM({});
