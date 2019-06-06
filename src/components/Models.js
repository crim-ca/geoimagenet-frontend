import React, {Component} from 'react';
import {withStyles, Divider, TextField, Button, Typography, CircularProgress} from '@material-ui/core';
import PlayArrow from '@material-ui/icons/PlayArrow';
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
        const result = await client.query({
            query: gql`
                query fetch_jobs {
                    jobs(process_id: "model-tester") {
                        id
                        status
                        status_location
                        user
                    }
                }
            `,
            fetchPolicy: 'no-cache'
        });
        const {data} = result;
        this.setState({benchmarks_jobs: data.jobs});
    };

    launch_job_handler = async (event, rowData) => {
        const result = await client.mutate({
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
        const {data: {launch_test: {message, success}}} = result;
        if (success) {
            notifier.ok(message);
        } else {
            notifier.error(message);
        }
        await this.query_jobs();
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
                    columns={[
                        {title: 'id', field: 'id'},
                        {title: 'id', field: 'id'},
                        {title: 'id', field: 'id'},
                    ]}
                    data={this.state.benchmarks_jobs}
                />
            </Grid>
        );
    }
}
