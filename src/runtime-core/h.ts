import { createVNode } from './createVNode';

export function h(type, prop?, children?) {
  return createVNode(type, prop, children);
}
