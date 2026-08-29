# SourceAnt design

The pieces every SourceAnt surface is built from: the colour tokens, the
primitives, and the graph renderer.

It exists because the alternative was copying. A design copied by hand drifts
the moment either copy changes, and the drift is invisible until somebody
notices the two products no longer look like one.

## What is in it, and what is not

Tokens, `Avatar`, `Badge`, `Button`, `Card`, `Logo`, `Modal`, and `CodeGraph`.

Nothing that knows what a workspace, a review or a proposal is. Those belong to
whichever application has them, and a package that grew to hold them would be
that application wearing a different name.

## Using it

Pin it by commit. There are no releases: this moves with the products that use
it, and a version number would be a promise nobody is keeping yet. A pinned
commit costs nothing and stops a change here breaking a build there.

```json
{
  "dependencies": {
    "@sourceant/design": "github:sourceant/design#<commit>"
  }
}
```

Take the Tailwind preset, and say which of your own files to scan:

```js
import design from '@sourceant/design/tailwind'

export default {
  presets: [design],
  content: ['./index.html', './src/**/*.{js,ts,vue}'],
}
```

Import the tokens once, before anything else:

```js
import '@sourceant/design/tokens.css'
```

Then use what you need:

```js
import { Button, Card, CodeGraph } from '@sourceant/design'
```

Source is shipped rather than a build, because every consumer already compiles
Vue. Vite needs to be told not to pre-bundle it:

```js
export default defineConfig({
  optimizeDeps: { exclude: ['@sourceant/design'] },
})
```

## Themes

Dark is the default. A `.light` class on the root element switches it; the
tokens are defined for both and nothing else needs to know which is on.

## Licence

MIT.
