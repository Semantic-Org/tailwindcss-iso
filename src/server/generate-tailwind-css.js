import { compile } from '@tailwindcss/node';
import { getTailwindClasses } from './get-tailwind-classes.js';

export async function generateTailwindCSS({
  content = '', // html and js content to scan
  css = '', // additional css to include in output
  importCSS = `@import "tailwindcss";`, // code to import tailwind
  candidates = [], // list of candidates to use to generate css
}) {

  // If no candidate array provided get it from content
  if(!candidates.length) {
    candidates = await getTailwindClasses({ content });
  }

  // Build source CSS — import Tailwind first so user @theme / @utility /
  // @custom-variant blocks land after the defaults and can override them.
  // Mirrors the browser build's ordering.
  const sourceCSS = css
    ? `${importCSS}\n${css}`
    : importCSS;

  // Compile CSS using @tailwindcss/node with file system support
  const compiler = await compile(sourceCSS, {
    base: process.cwd(),
    onDependency: () => {}, // No-op dependency tracking for JIT use
  });

  // Build the CSS with the extracted candidates and return tailwind css
  return compiler.build(candidates);
}
