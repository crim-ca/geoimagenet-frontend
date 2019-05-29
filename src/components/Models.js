import React from 'react';
import {withStyles, Paper, Divider, TextField, Button} from '@material-ui/core';
import {Mutation, Query} from "react-apollo";
import Table from './Table';
import gql from 'graphql-tag';

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
    <div className={classes.root}><Paper className={classes.content}>{children}</Paper></div>
));

export const Models = () => {
    const [values, setValues] = React.useState({
        model_name: new Date().toISOString(),
        file: null,
        validity: false,
    });
    const handle_change = name => event => {
        setValues({...values, [name]: event.target.value});
    };
    const handle_file_change = ({target: {validity, files: [file]}}) => {
        setValues({...values, file, validity});
    };
    const upload_change_handler = callback => () => {
        const {file, validity, model_name} = values;
        if (validity.valid) {
            callback({
                variables: {file, model_name}
            });
        }
    };
    const upload_is_valid = () => {
        return values.model_name.length > 0 && values.validity.valid;
    };

    return (
        <Grid>
            <Mutation mutation={UPLOAD_MODEL}>
                {upload_file => (
                    <React.Fragment>
                        <TextField
                            required
                            value={values.model_name}
                            onChange={handle_change('model_name')} />
                        <input
                            required
                            type='file'
                            onChange={handle_file_change} />
                        <Button
                            onClick={upload_change_handler(upload_file)}
                            disabled={!upload_is_valid()}>Upload</Button>
                    </React.Fragment>
                )}
            </Mutation>
            <Divider/>
            <Query query={MODELS}>
                {({data, loading, error}) => {
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
                        <Table data={data.models}/>
                    );
                }}
            </Query>
        </Grid>
    );
};
