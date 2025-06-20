# Isomorphic Tailwind Compiler

This library is designed to let you programatically generate tailwinds css from a string of content, designed for server-side (Node.js) and client-side (browser) environments.

This package uses the official Tailwind CSS engine, including a custom single-threaded WASM build of the Oxide scanner for safe and efficient use in the browser. It is useful for generating tailwinds programatically in a build step in a uniform way on the client and server.


> This is being used as part of primary tooling for tailwind support inside web components for [@semantic-org/semantic-next](https://github.com/Semantic-Org/Semantic-Next). You can see it in action in this [Tailwinds example](https://next.semantic-ui.com/examples/tailwind).

## Key Features
* **Extract Classes**: Extract candidate tailwind classes from string
* **Generate CSS from String**: Generate tailwind css from strings of html and js
* **Isomorphic**: Works seamlessly in Node.js and modern browsers.
* **WASM-Powered**: Uses a WebAssembly-based scanner in the browser for high performance without dependencies.
* **Zero Production Dependencies**: Clean and lightweight for your projects.
* **Component Plugin Included**: Also includes a plugin for easy integration with a component definition structure.

## Environment Selection

By default, the package automatically selects the appropriate engine based on your environment (Node.js vs browser). However, you can explicitly force a specific implementation:

### Force Browser Engine (WASM)
```javascript
import { generateTailwindCSS } from 'tailwindcss-iso/browser';

// Will always use the WASM-based scanner, even in Node.js
const tailwindCSS = await generateTailwindCSS({ content, css });
```

### Force Server Engine (Native)
```javascript
import { generateTailwindCSS } from 'tailwindcss-iso/server';

// Will always use the native Node.js implementation
// Note: This will fail in browser environments
const tailwindCSS = await generateTailwindCSS({ content, css });
```

This is useful for testing, benchmarking, or when bundler environment detection isn't working as expected.

## Examples

### Generating CSS

```javascript
import { generateTailwindCSS } from 'tailwindcss-iso';

const css = '
  @theme {
    /* This changes the bluish grays to a monochrome color */
    --color-gray-100: theme(colors.zinc.100);
    --color-gray-300: theme(colors.zinc.300);
    --color-gray-700: theme(colors.zinc.700);
    --color-gray-950: theme(colors.zinc.950);
  }
'

const content = `
  <div class="p-4 bg-blue-500 text-white rounded-md hover:bg-blue-600">
    Hello, world!
  </div>
`;

const tailwindCSS = await generateTailwindCSS({ content, css });

// The `tailwindCSS` variable now contains the generated Tailwind styles.
// You can inject this into a <style> tag or save it to a file.
console.log(tailwindCSS);
```


### Getting Candidate Class Names

Note: the official terminology is "candidate classes" as these may include false positives. These are filtered when compiling the tailwind css with `generateTailwindCSS`.

#### Basic Usage
```javascript
import { getTailwindClasses } from 'tailwindcss-iso';

const content = `
  <div class="p-4 bg-blue-500 text-white rounded-md hover:bg-blue-600">
    Hello, world!
  </div>
`;

const classes = await getTailwindClasses({ content });

// Returns an array of classes as strings
console.log(classes);
// Output: ['p-4', 'bg-blue-500', 'text-white', 'rounded-md', 'hover:bg-blue-600']
```

#### With Position Information

```javascript
import { getTailwindClasses } from 'tailwindcss-iso';

const content = `
  <div class="p-4 bg-blue-500 text-white rounded-md hover:bg-blue-600">
    Hello, world!
  </div>
`;

const classes = await getTailwindClasses({ content, returnPositions: true });

// Returns an array of objects with position information
console.log(classes);
// Output: [
//   { candidate: 'p-4', position: 15 },
//   { candidate: 'bg-blue-500', position: 19 },
//   ...
// ]
```

#### Content Type Detection

```javascript
// Mixed HTML and JavaScript content (default: 'jsx')
const mixedContent = `
  // JSX component
  <button className="px-4 py-2 bg-blue-500 text-white rounded">
    Click me
  </button>
  
  // JavaScript patterns
  const dynamicClasses = "flex items-center space-x-2";
  element.classList.add('hidden', 'sm:block');
`;

const classes = await getTailwindClasses({ content: mixedContent });
```

For specific content types, you can override the extension:

```javascript
// Pure HTML content
const htmlContent = '<div class="container mx-auto p-4">Content</div>';
const classes = await getTailwindClasses({ 
  content: htmlContent, 
  extension: 'html' 
});

// TypeScript/TSX content
const tsxContent = `const Button: React.FC = () => <button className="btn-primary">Click</button>`;
const classes = await getTailwindClasses({ 
  content: tsxContent, 
  extension: 'tsx' 
});

// Vue component
const vueContent = `<template><div class="vue-component bg-red-500"></div></template>`;
const classes = await getTailwindClasses({ 
  content: vueContent, 
  extension: 'vue' 
});
```

**Extension Parameter:**

The `extension` parameter provides a hint to the Tailwind scanner about how to parse the content. It defaults to `'html'`. You can pass different file extensions to potentially optimize class extraction for your specific content type.

## Bundled Versions

- **CDN / Direct Usage**: Use `cdn` or `importmap` condition which bundles deps
- **Clientside**: Use `/browser` condition with a build tool like Vite for a clientside build.
- **Serverside**: Use `/server` or `node` condition for a serverside build.

## CDN / Import Map Usage

The `/cdn` and `/importmap` export condition can be used to get a version with dependencies bundled. This is useful in particular because `css` imports are not supported by esm in the browser and only with build tools like Vite. If you are not using a build tool you will need to use this endpoint.

```html
<script type="module">
  // Automatically gets bundled version from CDNs like jsdelivr, unpkg
  import { generateTailwindCSS } from 'https://cdn.jsdelivr.net/npm/tailwindcss-iso';

  const css = await generateTailwindCSS({
    content: '<div class="bg-blue-500 text-white p-4">Hello World</div>'
  });

  // Inject into page
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
</script>
```

## Common Issues

If you are using Vite or a Vite based tool like Astro you will need to add this package to the exclude list for `optimizeDeps` for the wasm file to be accessed properly

More information in the [Vite Docs](https://vite.dev/config/dep-optimization-options#optimizedeps-exclude)

```
export default defineConfig({
  optimizeDeps: 
    force: true, // might not always be necessary
    exclude: ['tailwindcss-iso'],
  },
});
```

## License

[ISC](LICENSE)
