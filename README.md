# Demo Plugin ![CircleCI branch](https://img.shields.io/circleci/project/github/mattermost/xenia-plugin-taskcenter/master.svg)

This plugin demonstrates the capabilities of a Xenia plugin. It includes the same build scripts as [xenia-plugin-sample](https://github.com/xzl8028/xenia-plugin-sample), but implements all supported server-side hooks and registers a component for each supported client-side integration point. See [server/README.md](server/README.md) and [webapp/README.md](webapp/README.md) for more details. The plugin also doubles as a testbed for verifying plugin functionality during release testing.

Feel free to base your own plugin off this repository, removing or modifying components as needed. If you're already familiar with what plugins can do, consider starting from [xenia-plugin-sample](https://github.com/xzl8028/xenia-plugin-sample) instead, which includes the same build framework but omits the demo implementations.

Note that this plugin is authored for Xenia 5.2 and later, and is not compatible with earlier releases of Xenia.

For details on getting started, see [xenia-plugin-sample](https://github.com/xzl8028/xenia-plugin-sample).
