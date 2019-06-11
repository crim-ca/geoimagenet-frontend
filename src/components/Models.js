import React, {Component} from 'react';
import {withStyles, Divider, TextField, Button, Typography, CircularProgress, Link} from '@material-ui/core';
import PlayArrow from '@material-ui/icons/PlayArrow';
import Publish from '@material-ui/icons/Publish';
import Lock from '@material-ui/icons/Lock';
import {Mutation, Query} from "react-apollo";
import MaterialTable from 'material-table';
import gql from 'graphql-tag';
import {tableIcons} from '../utils/react';
import {notifier} from '../utils';
import {client} from '../utils/apollo';
import {features} from '../../features';

const MODELS = gql`
    query models {
        models {
            id
            name
            path
            created
        }
    }
`;
const UPLOAD_MODEL = gql`
    mutation upload_model($file: Upload!, $model_name: String!) {
        upload_model(model_name: $model_name, file: $file) {
            success
            message
            model {
                name
            }
        }
    }
`;
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
const UploadForm = withStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        height: '40px',
        '& > *': {
            marginRight: theme.values.gutterSmall,
        }
    }
}))(({classes, children}) => (
    <div className={classes.root}>{children}</div>
));


export class Models extends Component {

    state = {
        model_name: new Date().toISOString(),
        file: null,
        validity: false,
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

    handle_change = name => event => {
        this.setState({...this.state, [name]: event.target.value});
    };

    handle_file_change = ({target: {validity, files: [file]}}) => {
        this.setState({...this.state, file, validity});
    };

    upload_change_handler = callback => () => {
        const {file, validity, model_name} = this.state;
        if (validity.valid) {
            callback({
                variables: {file, model_name}
            });
        }
    };

    upload_is_valid = () => {
        return this.state.model_name.length > 0 && this.state.validity.valid;
    };

    upload_completed = async (data) => {
        if (data.upload_model.success) {
            await this.refetch();
        } else {
            notifier.error(`There was a problem during upload: ${data.upload_model.message}.`);
        }
    };

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
                        jobs(process_id: "model-tester") {
                            id
                            status
                            progress
                            status_location
                            visibility
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
        this.setState({benchmarks_jobs: data.jobs});
    };


    launch_job_handler = async (event, rowData) => {
        let result;
        try {
            result = await client.mutate({
                mutation: gql`
                    mutation launch_test_job($model_id: ID!) {
                        launch_test(model_id: $model_id) {
                            success
                            message
                            job {
                                status_location
                            }
                        }
                    }
                `,
                variables: {
                    model_id: rowData.id
                }
            });
        } catch (e) {
            notifier.error('We were unable to launch the model testing job.');
            throw e;
        }
        const {data: {launch_test: {message, success}}} = result;
        if (success) {
            notifier.ok('Model testing was launched.');
            await this.query_jobs();
        } else {
            notifier.error(message);
        }
        await this.query_jobs();
    };

    benchmark_visibility_handler = (job_id, visibility) => async () => {
        let result;
        try {
            result = await client.mutate({
                mutation: gql`
                    mutation change_visibility($job_id: ID!, $visibility: Visibility!) {
                        benchmark_visibility(job_id: $job_id, visibility: $visibility) {
                            success
                            message
                        }
                    }
                `,
                variables: {
                    job_id: job_id,
                    visibility: visibility,
                }
            });
        } catch (e) {
            notifier.error('There was a problem with the visibility change request.');
            throw e;
        }
        const {data: {benchmark_visibility: {success, message}}} = result;
        if (success) {
            notifier.ok('Benchmark visibility updated.');
            await this.query_jobs();
        } else {
            notifier.error(message);
        }
    };

    render() {
        return (
            <Grid>
                <Mutation mutation={UPLOAD_MODEL} onCompleted={this.upload_completed}>
                    {(upload_file, {loading, error}) => (
                        <UploadForm>
                            <TextField
                                required
                                value={this.state.model_name}
                                onChange={this.handle_change('model_name')}/>
                            <input
                                required
                                type='file'
                                onChange={this.handle_file_change}/>
                            <Button
                                onClick={this.upload_change_handler(upload_file)}
                                disabled={!this.upload_is_valid()}>Upload</Button>
                            <Link
                                target='_blank'
                                href={THELPER_MODEL_UPLOAD_INSTRUCTIONS}>
                                Click here for instructions on how to prepare your model for upload.
                            </Link>
                            {loading && (
                                <React.Fragment>
                                    <Typography variant='body1' display='inline'>Uploading...</Typography>
                                    <CircularProgress/>
                                </React.Fragment>
                            )}
                            {error && notifier.error(`there was an error: ${error.message}. please try again later.`)}
                        </UploadForm>
                    )}
                </Mutation>
                <Divider/>
                <Query query={MODELS}>
                    {({data, loading, error, refetch}) => {
                        this.refetch = refetch;
                        if (loading) {
                            return <p>loading</p>;
                        }
                        if (error) {
                            return <p>{error.message}</p>;
                        }
                        if (data.models.length === 0) {
                            return <p>No models have been uploaded yet.</p>;
                        }
                        return (
                            <div>
                                <MaterialTable
                                    actions={[
                                        {
                                            icon: PlayArrow,
                                            tooltip: 'Launch Tests',
                                            onClick: this.launch_job_handler
                                        }
                                    ]}
                                    title='Models'
                                    icons={tableIcons}
                                    columns={[
                                        {title: 'Name', field: 'name'},
                                        {title: 'Path', field: 'path'},
                                        {title: 'Created', field: 'created'},
                                    ]}
                                    data={data.models}
                                />
                            </div>
                        );
                    }}
                </Query>
                <MaterialTable
                    title='Benchmarks jobs'
                    icons={tableIcons}
                    actions={[
                        rowData => ({
                            icon: Publish,
                            tooltip: 'publish',
                            onClick: this.benchmark_visibility_handler(rowData.id, 'public'),
                            disabled: rowData.visibility === 'public',
                        }),
                        rowData => ({
                            icon: Lock,
                            tooltip: 'unpublish',
                            onClick: this.benchmark_visibility_handler(rowData.id, 'private'),
                            disabled: rowData.visibility === 'private',
                        }),
                    ]}
                    columns={[
                        {title: 'ID', field: 'id'},
                        {title: 'Visibility', field: 'visibility'},
                        {title: 'Status', field: 'status'},
                        {title: 'Message', field: 'status_location'},
                        {title: 'Progress', field: 'progress'},
                    ]}
                    data={this.state.benchmarks_jobs}
                />
            </Grid>
        );
    }
}
