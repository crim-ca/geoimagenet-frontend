import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles, Paper, Divider, Button} from '@material-ui/core';
import {observer} from 'mobx-react';
import {Query, Mutation} from 'react-apollo';
import gql from 'graphql-tag';

import DatasetsList from './datasets/DatasetsList.js';
import {StoreActions} from '../store';
import {DATASETS, WRITE} from '../domain/constants.js';

import {UserInteractions} from '../domain/user-interactions.js';
import Table from "./Table";

const GET_DATASETS = gql`
    query datasets {
        datasets {
            id
            name
            classes_count
            annotations_count
            created
        }
    }
`;
const GET_JOBS = gql`
    query jobs {
        jobs(process_id: "batch-creation") {
            id
            status
            status_message
        }
    }
`;
const LAUNCH_BATCH = gql`
    mutation batch {
        start_batch {
            success
            job {
                status
                status_message
            }
        }
    }
`;

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

    /**
     *
     * @type {Object}
     * @property {Object} state_proxy
     * @property {StoreActions} store_actions
     */
    static propTypes = {
        state_proxy: PropTypes.object.isRequired,
        store_actions: PropTypes.instanceOf(StoreActions).isRequired,
        user_interactions: PropTypes.instanceOf(UserInteractions).isRequired,
    };

    render() {
        const {acl} = this.props.state_proxy;
        return (
            <DatasetLayout>
                <DatasetsPaper>
                    <Query query={GET_DATASETS}>
                        {({data, loading, error}) => {
                            if (loading) {
                                return <p>loading</p>;
                            }
                            if (error) {
                                return <p>{error.message}</p>;
                            }
                            return (
                                <DatasetsList datasets={data.datasets}
                                              state_proxy={this.props.state_proxy}
                                              store_actions={this.props.store_actions}/>
                            );
                        }}
                    </Query>
                    {acl.can(WRITE, DATASETS)
                        ? (
                            <React.Fragment>
                                <Divider/>
                                <Mutation mutation={LAUNCH_BATCH}>
                                    {(launchCreation) => (
                                        <Button onClick={launchCreation}
                                                variant='contained'
                                                color='primary'>
                                            Create Patches
                                        </Button>
                                    )}
                                </Mutation>
                                <Divider/>
                                <Query query={GET_JOBS}>
                                    {({data, loading, error}) => {
                                        if (loading) {
                                            return <p>loading</p>;
                                        }
                                        if (error) {
                                            return <p>{error.message}</p>;
                                        }
                                        return (
                                            <Table data={data.jobs} />
                                        );
                                    }}
                                </Query>
                            </React.Fragment>
                        )
                        : null
                    }
                </DatasetsPaper>
            </DatasetLayout>
        );
    }
}

export {Datasets};
