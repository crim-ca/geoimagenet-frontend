import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core';
import {observer} from 'mobx-react';

import {DatasetsTable} from './DatasetsTable';
import {DATASETS, WRITE} from '../../constants.js';

import {DatasetCreationJobsTable} from './DatasetCreationJobsTable';

const Layout = withStyles(({values}) => ({
    grid: {
        display: 'grid',
        gridTemplateColumns: `${values.gutterMedium} 1fr minmax(300px, max-content) 1fr ${values.gutterMedium}`,
    },
    children: {
        gridColumn: '3/4',
        display: 'grid',
        gridTemplateRows: 'min-content',
        gridGap: values.gutterSmall,
    }
}))(({classes, children}) => {
    return <div className={classes.grid}>
        <div className={classes.children}>{children}</div>
    </div>;
});

@observer
class Datasets extends Component {

    /**
     *
     * @type {Object}
     * @property {Object} state_proxy
     */
    static propTypes = {
        state_proxy: PropTypes.object.isRequired,
    };

    render() {
        const {acl} = this.props.state_proxy;
        return (
            <Layout>
                <DatasetsTable ml_endpoint={ML_ENDPOINT} />
                {acl.can(WRITE, DATASETS)
                    ? (
                        <React.Fragment>
                            <DatasetCreationJobsTable />
                        </React.Fragment>
                    )
                    : null
                }
            </Layout>
        );
    }
}

export {Datasets};
