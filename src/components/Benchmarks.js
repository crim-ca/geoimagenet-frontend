import React, {Component} from 'react';
import {withStyles} from '@material-ui/core';
import MaterialTable from 'material-table';
import gql from 'graphql-tag';
import {tableIcons} from '../utils/react';
import {notifier} from '../utils';
import {client} from '../utils/apollo';
import {features} from '../../features';

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

    constructor(props) {
        super(props);
        if (features.subscriptions) {
            this.subscribe_jobs();
        } else {
            this.query_jobs();
        }
    }

    subscribe_jobs = async () => {
        const observable = client.subscribe({
            query: MODEL_TESTER_JOBS,
        });
        observable.subscribe(data => console.log(data));
    };

    query_jobs = async () => {
        let result;
        try {
            result = await client.query({
                query: gql`
                    query fetch_jobs {
                        public_benchmarks {
                            id
                        }
                    }
                `,
                fetchPolicy: 'no-cache'
            });
        } catch (e) {
            notifier.error('We were unable to fetch the model testing jobs.');
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
                        {title: 'ID', field: 'id'},
                        {title: 'Result', field: 'result'},
                    ]}
                    data={this.state.benchmarks_jobs}
                />
            </Grid>
        );
    }
}
