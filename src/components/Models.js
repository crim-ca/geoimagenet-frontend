import React, {Component} from 'react';
import {withStyles, Divider, TextField, Button, Typography, CircularProgress} from '@material-ui/core';
import {Mutation, Query} from "react-apollo";
import MaterialTable from 'material-table';
import gql from 'graphql-tag';
import {tableIcons} from '../utils/react';
import {notifier} from '../utils';

const MODELS = gql`
    query models {
        models {
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

    constructor(props) {
        super(props);
        this.state = {
            model_name: new Date().toISOString(),
            file: null,
            validity: false,
        };
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
                                            icon: 'save', tooltip: 'Launch Tests', onClick: (event, rowData) => {
                                                console.log(event, rowData);
                                            }
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
            </Grid>
        );
    }
}
