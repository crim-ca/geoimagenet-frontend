import React, {Component} from 'react';
import {withStyles} from '@material-ui/core';
import PropTypes from 'prop-types';
import MaterialTable from 'material-table';
import gql from 'graphql-tag';
import {tableIcons} from '../utils/react';
import {features} from '../../features';
import {NotificationManager} from 'react-notifications';

const MODEL_TESTER_JOBS = gql`
    subscription model_tester_jobs {
        jobs(process_id: "model_tester") {
            id
            status
        }
    }
`;

const Grid = withStyles({
    root: {
        display: 'grid',
        gridTemplateColumns: '1fr max-content 1fr',
    },
    content: {
        gridColumn: '2/3',
    }
})(({classes, children}) => (
    <div className={classes.root}>
        <div className={classes.content}>{children}</div>
    </div>
));

export class Benchmarks extends Component {

    state = {
        benchmarks_jobs: []
    };

    static propTypes = {
        client: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        if (features.subscriptions) {
            this.subscribe_jobs();
        } else {
            this.query_jobs();
        }
    }

    subscribe_jobs = async () => {
        const {client} = this.props;
        const observable = client.subscribe({
            query: MODEL_TESTER_JOBS,
        });
        observable.subscribe(data => console.log(data));
    };

    query_jobs = async () => {
        const {client} = this.props;
        let result;
        try {
            result = await client.query({
                query: gql`
                    query fetch_jobs {
                        public_benchmarks {
                            owner
                            model {
                                id
                                created
                            }
                            result {
                                metrics {
                                    top_1_accuracy
                                    top_5_accuracy
                                }
                            }
                            dataset {
                                id
                            }
                            job {
                                finished
                            }
                        }
                    }
                `,
                fetchPolicy: 'no-cache'
            });
        } catch (e) {
            NotificationManager.error('We were unable to fetch the model testing jobs.');
            throw e;
        }
        const {data} = result;
        this.setState({benchmarks_jobs: data.public_benchmarks});
    };

    render() {
        return (
            <Grid>
                <MaterialTable
                    title='Public Benchmarks'
                    icons={tableIcons}
                    columns={[
                        {title: 'Owner', field: 'owner'},
                        {title: 'Model', field: 'model.id'},
                        {title: 'Dataset', field: 'dataset.id'},
                        {title: 'Model upload', field: 'model.created'},
                        {title: 'Test completed', field: 'job.finished'},
                        {title: 'Top 1 accuracy', field: 'result.metrics.top_1_accuracy'},
                        {title: 'Top 5 accuracy', field: 'result.metrics.top_5_accuracy'},
                    ]}
                    data={this.state.benchmarks_jobs}
                />
            </Grid>
        );
    }
}
