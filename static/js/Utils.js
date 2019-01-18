export const toggle_all_nested_checkboxes = (parent, checked) => {
    const checkboxes = parent.querySelectorAll('input[type=checkbox]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = checked;
    });
};
