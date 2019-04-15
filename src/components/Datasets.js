import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles, Paper, Divider, Button} from '@material-ui/core';
import {observer} from 'mobx-react';

import DatasetsList from './datasets/DatasetsList.js';
import {Dataset} from '../domain/entities.js';
import {StoreActions} from '../store';

const DatasetLayout = withStyles({
    grid: {
        display: 'grid',
        gridTemplateColumns: '1fr minmax(300px, max-content) 1fr',
    },
    children: {
        gridColumn: '2/3',
    }
})(props => {
    const {classes, children} = props;
    return <div className={classes.grid}>
        <div className={classes.children}>{children}</div>
    </div>;
});

const DatasetsPaper = withStyles(theme => ({
    root: {
        padding: theme.values.gutterSmall,
        gridGap: theme.values.gutterSmall,
        display: 'grid',
        gridTemplateRows: 'max-content',

    }
}))(Paper);

@observer
class Datasets extends Component {

    static propTypes = {
        state_proxy: PropTypes.object.isRequired,
        store_actions: PropTypes.instanceOf(StoreActions).isRequired,
    };

    render() {
        const {selected_dataset} = this.props.state_proxy.datasets;
        return (
            <DatasetLayout>
                <DatasetsPaper>
                    <DatasetsList state_proxy={this.props.state_proxy} store_actions={this.props.store_actions} />
                    <Divider />
                    <Button disabled={!(selected_dataset instanceof Dataset)} variant='contained' color='primary'>Download</Button>
                </DatasetsPaper>
            </DatasetLayout>
        );
    }
}

export {Datasets};
