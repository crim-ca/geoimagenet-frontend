// @flow strict

export const debounced = (delay: number, func: () => void) => {
    let timer_id;
    return (...args: string | number[]) => {
        if (timer_id) {
            clearTimeout(timer_id);
        }
        timer_id = setTimeout(() => {
            func(...args);
            timer_id = null;
        }, delay);
    };
};
