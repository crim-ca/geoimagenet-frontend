export const debounced = (delay, func) => {
    let timer_id;
    return (...args) => {
        if (timer_id) {
            clearTimeout(timer_id);
        }
        timer_id = setTimeout(() => {
            func(...args);
            timer_id = null;
        }, delay);
    };
};
