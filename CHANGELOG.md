# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2026-08-30

First release. Versioned on its own, because nothing about the components is
tied to a release of the core.

### Added

- Twenty five components shared by everything SourceAnt puts on a screen, from
  buttons, fields and modals through to the code graph, diffs and rendered
  markdown
- One set of design tokens, published as `@sourceant/design/tokens.css` and as a
  Tailwind preset, so a consumer takes the vocabulary rather than restating it
- A check that every path the package advertises actually resolves, run before
  anything is published
