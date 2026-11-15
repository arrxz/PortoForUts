import { createRoot, type Root } from 'react-dom/client';
import { registry } from '../islands';

const roots = new WeakMap<Element, Root>();

export function mountIslands(scope: Element) {
  scope.querySelectorAll<HTMLElement>('[data-island]').forEach((el) => {
    const Component = registry[el.dataset.island!];
    if (!Component) return;
    const root = createRoot(el);
    root.render(<Component {...JSON.parse(el.dataset.props ?? '{}')} />);
    roots.set(el, root);
  });
}

export function unmountIslands(scope: Element) {
  scope.querySelectorAll<HTMLElement>('[data-island]').forEach((el) => {
    roots.get(el)?.unmount();
    roots.delete(el);
  });
}
