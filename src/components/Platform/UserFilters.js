// @flow strict
import React from 'react';
import {withStyles} from "@material-ui/core";
import Popper from '@material-ui/core/Popper';
import Button from '@material-ui/core/Button';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';

type Props = {};
type State = {
    anchor: HTMLElement,
    open: boolean,
};

const PopperMarginLessPopper = withStyles({
    tooltip: {
        zIndex: 100,
    },
})(Popper);

const VeryVeryOnTheTopPaper = withStyles({
    root: {
        border: '4px solid blue',
        margin: 0,
        padding: 0,
        '& ul': {
            padding: 0,
        },
        '& > ul:not(:first-child)': {
            borderTop: '4px solid blue',
        }
    }
})(Paper);

class UserFilters extends React.Component<Props, State> {

    state = {
        open: false,
    };

    toggle = (event) => {
        this.setState({open: true, anchor: event.currentTarget});
    };

    render() {
        const {anchor} = this.state;
        return (
            <>
                <Button onClick={this.toggle}>click</Button>
                <PopperMarginLessPopper open={this.state.open}
                                        anchorEl={anchor}
                                        placement='bottom-end'>
                    <VeryVeryOnTheTopPaper>
                        <ul>
                            <li>all filters</li>
                        </ul>
                        <ul>
                            <li>owner's filters</li>
                        </ul>
                    </VeryVeryOnTheTopPaper>
                </PopperMarginLessPopper>
            </>
        );
    }
}

export {UserFilters};
