import { createVNode } from './createVNode';
import { render } from './render';

export function createApp(rootComponent) {
  return {
    mount(rootContainer) {
      // component -> vnode
      const vnode = createVNode(rootComponent);

      render(vnode, rootContainer);
    },
  };
}
