import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import type { Root, Element } from 'hast';
import { visit } from 'unist-util-visit';
import type { Locale } from './i18n/config';

function rehypeMermaid() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      if (
        node.tagName === 'pre' &&
        node.children.length === 1 &&
        (node.children[0] as Element).tagName === 'code'
      ) {
        const code = node.children[0] as Element;
        const className = (code.properties?.className as string[]) || [];
        if (className.includes('language-mermaid')) {
          const text = getTextContent(code);
          node.properties = { className: ['mermaid'] };
          node.children = [{ type: 'text', value: text }];
        }
      }
    });
  };
}

function rehypeRewriteLinks(locale: Locale = 'fr') {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      if (node.tagName === 'a' && typeof node.properties?.href === 'string') {
        const href = node.properties.href;
        const match = href.match(/^\.\.\/([a-z0-9-]+)\/$/);
        if (match) {
          node.properties.href = `/${locale}/topics/${match[1]}`;
        }
      }
    });
  };
}

function getTextContent(node: Element): string {
  let text = '';
  for (const child of node.children) {
    if (child.type === 'text') {
      text += child.value;
    } else if (child.type === 'element') {
      text += getTextContent(child);
    }
  }
  return text;
}

function createProcessor(locale: Locale = 'fr') {
  return unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeKatex)
    .use(rehypeSlug)
    .use(rehypeMermaid)
    .use(() => rehypeRewriteLinks(locale))
    .use(rehypeStringify, { allowDangerousHtml: true });
}

export async function markdownToHtml(markdown: string, locale: Locale = 'fr'): Promise<string> {
  const processor = createProcessor(locale);
  const result = await processor.process(markdown);
  return String(result);
}

export function extractTitle(markdown: string, locale: Locale = 'fr'): string {
  const match = markdown.match(/^#\s+(.+)$/m);
  if (match) return match[1].replace(/\*\*/g, '').trim();
  const match2 = markdown.match(/^##\s*(.+)$/m);
  if (match2) return match2[1].replace(/\*\*/g, '').trim();
  return locale === 'en' ? 'Untitled' : 'Sans titre';
}

export function extractFirstParagraph(markdown: string): string {
  const lines = markdown.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('---') && !trimmed.startsWith('-') && !trimmed.startsWith('```')) {
      return trimmed.slice(0, 200);
    }
  }
  return '';
}
