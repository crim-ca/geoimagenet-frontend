// @flow strict

import React from 'react';
import Typography from "@material-ui/core/Typography";

type Props = {
    unique_id: string,
    checked: boolean,
    change_handler: (event: {
        target: {
            checked: boolean
        }
    }) => void,
    label: string,
};
class CheckboxLineInput extends React.Component<Props> {
    render() {
        const {unique_id, checked, change_handler, label} = this.props;
        return (
            <>
                <input type='checkbox'
                       id={unique_id}
                       checked={checked}
                       onChange={change_handler} />
                <label htmlFor={unique_id}>
                    <Typography style={{cursor: 'pointer'}}
                                variant='body2'>{label}</Typography>
                </label>
            </>
        );
    }
}
export {CheckboxLineInput};
