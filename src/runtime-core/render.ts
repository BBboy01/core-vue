import { isObject } from '../shared/index';
import { createComponentInstance, setupComponent } from './component';

export function render(vnode, container) {
  patch(vnode, container);
}

function patch(vnode, container) {
  // 处理组件

  // 是否是 element 类型
  if (typeof vnode.type === 'string') {
    processElement(vnode, container);
  } else if (isObject(vnode.type)) {
    processComponent(vnode, container);
  }
}

function processComponent(vnode: any, container: any) {
  mountComponent(vnode, container);
}
function mountComponent(vnode: any, container: any) {
  const instance = createComponentInstance(vnode);

  setupComponent(instance);
  setupRenderEffect(instance, container);
}

function setupRenderEffect(instance: any, container: any) {
  const subTree = instance.render();

  // vnode -> patch
  // vnode -> element -> mountElement
  patch(subTree, container);
}

function processElement(vnode: any, container: any) {
  mountElement(vnode, container);
}

function mountElement(vnode: any, container: any) {
  const { type, children, props } = vnode;

  const el = document.createElement(type);
  if (typeof children === 'string') {
    el.textContent = children;
  } else if (Array.isArray(children)) {
    mountChildren(vnode, el);
  }
  for (const key in props) {
    const val = props[key];
    el.setAttribute(key, val);
  }

  container.append(el);
}

function mountChildren(vnode, container) {
  vnode.children.forEach((v) => patch(v, container));
}
