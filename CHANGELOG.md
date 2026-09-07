# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.0] - 2026-09-01

The components the dashboard kept for itself, so both surfaces can share one
set. Everything from 0.1.0 keeps working unchanged.

### Added

- A failed read with the reason and a retry, a list placeholder that holds the
  shape of what is coming, a dismissible action error, page navigation with the
  helpers that decide which numbers to offer, themed line art, and a theme
  switch
- `useTheme`, which reads the theme off the root element so a toggle renders the
  right icon on first paint
- The severity scale and the ordered figure palette, so a severity means the
  same colour wherever it is shown

### Changed

- `Tabs` carries an icon and can turn an option off, which is what kept
  applications spelling the strip out by hand: a switcher whose options are not
  all available has to say so on the option itself
- `Loading` takes the richer spinner and can name where the work is going, which
  makes the second loading treatment unnecessary

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
