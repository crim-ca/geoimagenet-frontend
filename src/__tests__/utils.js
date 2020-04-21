// @flow strict

const wait: (number) => Promise<void> = (timeout: number) => new Promise(resolve => setTimeout(resolve, timeout));

function copyProps(src, target) {
  Object.defineProperties(target, {
    ...Object.getOwnPropertyDescriptors(src),
    ...Object.getOwnPropertyDescriptors(target),
  });
}

export {
  wait,
  copyProps,
};
