# Version 1.0.5-3
- Iterated on tweaks to fix wasm import in browser so that it can be detectable by esbuild as an asset and used on a cdn

# Version 1.0.2
Added top level fields in `package.json` for CDNs. This may improve resolution in some cases.

# Version 1.0.1

Added new conditional exports for `cdn` that bundle dependencies. This is to avoid issues from CDN that do not support raw imports when parsing imported tailwind css

This solves issues from CDN like
```javascript
Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/css". Strict MIME type checking is enforced for module scripts per HTML spec.
```

# Version 1.0.0

Initial Release
