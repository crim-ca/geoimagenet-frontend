import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles, Paper, Button} from '@material-ui/core';
import {observer} from 'mobx-react';
import {Query} from 'react-apollo';
import gql from 'graphql-tag';

import DatasetsList from './datasets/DatasetsList.js';
import {StoreActions} from '../store';
import {DATASETS, WRITE} from '../domain/constants.js';

import Table from "./Table";
import {NotificationManager} from 'react-notifications';
import ApolloClient from "apollo-client";

const GET_DATASETS = gql`
    query datasets {
        datasets(status: finished) {
            id
            name
            classes_count
            annotations_count
            created
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
})(({classes, children}) => {
    return <div className={classes.grid}>
        <div className={classes.children}>{children}</div>
    </div>;
});

const DatasetsPaper = withStyles(({values}) => ({
    root: {
        padding: values.gutterSmall,
        gridGap: values.gutterSmall,
        display: 'grid',
        gridTemplateRows: 'max-content',

    }
}))(Paper);

@observer
class Datasets extends Component {

    state = {
        dataset_creation_jobs: []
    };

    /**
     *
     * @type {Object}
     * @property {Object} state_proxy
     * @property {StoreActions} store_actions
     */
    static propTypes = {
        state_proxy: PropTypes.object.isRequired,
        store_actions: PropTypes.instanceOf(StoreActions).isRequired,
        client: PropTypes.instanceOf(ApolloClient).isRequired,
    };

    constructor(props) {
        super(props);
        this.fetch_dataset_creation_jobs();
    }

    launch_dataset_creation = async () => {
        const {client} = this.props;
        let result;
        try {
            result = await client.mutate({
                mutation: gql`
                    mutation batch {
                        launch_dataset_creation_job {
                            success
                            message
                        }
                    }
                `,

            });
        } catch (e) {
            NotificationManager.error('We were unable to start the dataset creation job.');
            throw e;
        }
        const {data: {launch_dataset_creation_job: {success, message}}} = result;
        if (!success) {
            NotificationManager.error(message);
            return;
        }
        await this.fetch_dataset_creation_jobs();
    };

    fetch_dataset_creation_jobs = async () => {
        const {client} = this.props;
        let result;
        try {
            result = await client.query({
                query: gql`
                    query jobs {
                        jobs(process_id: "batch-creation") {
                            id
                            status
                            status_message
                            progress
                        }
                    }
                `
            });
        } catch (e) {
            NotificationManager.error('There was an error while fetching the dataset creation jobs.');
            throw e;
        }
        const {data: {jobs}} = result;
        this.setState({dataset_creation_jobs: jobs});
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
                            if (data.datasets.length === 0) {
                                return <p>no datasets yet</p>;
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
                                <Button onClick={this.launch_dataset_creation}
                                        variant='contained'
                                        color='primary'>
                                    Create Patches
                                </Button>
                                <Table data={this.state.dataset_creation_jobs}/>
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
