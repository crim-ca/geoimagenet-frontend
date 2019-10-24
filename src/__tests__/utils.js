// @flow strict

export const wait: (number) => Promise<void> = (timeout: number) => new Promise(resolve => setTimeout(resolve, timeout))
