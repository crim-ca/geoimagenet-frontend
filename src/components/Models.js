import React from 'react';
import {withStyles, Paper, Divider} from '@material-ui/core';
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
    mutation upload_model($file: Upload!) {
        upload_model(model_name: "model_name", file: $file) {
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


const upload_change_handler = callback => ({target: {validity, files: [file]}}) => {
    console.log(validity, file);
    if (validity.valid) {
        callback({
                variables: { file }
            }
        );
    }
};

export const Models = () => (
    <Grid>
        <Mutation mutation={UPLOAD_MODEL}>
            {upload_file => (
                <input
                    required
                    type='file'
                    onChange={upload_change_handler(upload_file)}
                />
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
