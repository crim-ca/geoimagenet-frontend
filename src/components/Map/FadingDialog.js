// @flow strict

import React from 'react';
import Popper from "@material-ui/core/Popper";
import Fade from "@material-ui/core/Fade";

type Props = {
    children: {},
    anchor: HTMLElement | null,
    open: boolean,
};

class FadingDialog extends React.Component<Props> {
    render() {
        return (
            <Fade in={this.props.open}>
                {this.props.anchor !== null
                    ? (
                        <Popper open
                                disablePortal
                                style={{marginTop: '11px'}}
                                anchorEl={this.props.anchor}
                                placement='bottom-end'>
                            {this.props.children}
                        </Popper>
                    ) : <div />
                }
            </Fade>
        );
    }
}

export {FadingDialog};
