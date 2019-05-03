import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles, Paper, Divider, Button, Select, MenuItem} from '@material-ui/core';
import {observer} from 'mobx-react';
import {Query} from 'react-apollo';
import gql from 'graphql-tag';

import DatasetsList from './datasets/DatasetsList.js';
import {StoreActions} from '../store';
import {DATASETS, WRITE} from '../domain/constants.js';

import {UserInteractions} from '../domain/user-interactions.js';

const GET_DATASETS = gql`
    query GetDatasets {
        datasets {
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

const DownloadContainer = withStyles({
    root: {
        display: 'flex',
        flexDirection: 'row',
        '& > *': {
            width: '50%',
        }
    }
})(props => {
    const {classes, children} = props;
    return <div className={classes.root}>{children}</div>;
});

@observer
class Datasets extends Component {

    state = {
        selected_taxonomy: null,
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
        user_interactions: PropTypes.instanceOf(UserInteractions).isRequired,
    };

    change_taxonomy_selection = (event) => {
        this.setState({
            selected_taxonomy: event.target.value
        });
    };

    launch_dataset_creation = async () => {
        const {selected_taxonomy} = this.state;
        const taxonomy_id = selected_taxonomy['versions'][0]['taxonomy_id'];
        await this.props.user_interactions.dataset_creation(taxonomy_id);
    };

    render() {
        const {acl, taxonomies} = this.props.state_proxy;
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
                                              store_actions={this.props.store_actions} />
                            );
                        }}
                    </Query>
                    {
                        acl.can(WRITE, DATASETS)
                            ? (
                                <React.Fragment>
                                    <Divider />
                                    <DownloadContainer>
                                        <Select onChange={this.change_taxonomy_selection}
                                                value={this.state.selected_taxonomy}>
                                            {
                                                taxonomies.map((taxonomy, i) => (
                                                    <MenuItem value={taxonomy}
                                                              key={i}>{taxonomy.name_en || taxonomy.name_fr}</MenuItem>
                                                ))
                                            }
                                        </Select>
                                        <Button onClick={this.launch_dataset_creation} variant='contained' color='primary'>Create
                                            Patches</Button>
                                    </DownloadContainer>
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
