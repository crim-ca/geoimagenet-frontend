// @flow strict
import React from 'react';
import {withStyles} from '@material-ui/core';
import {observer} from 'mobx-react';

import {DatasetsTable} from './DatasetsTable';
import {DatasetCreationJobsTable} from './DatasetCreationJobsTable';
import {DATASETS, WRITE} from '../../constants.js';

import type {GeoImageNetStore} from "../../store/GeoImageNetStore";

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

type Props = {
    state_proxy: GeoImageNetStore,
};

@observer
class Datasets extends React.Component<Props> {

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
