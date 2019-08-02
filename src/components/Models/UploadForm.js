// @flow

import {Button, CircularProgress, Link, TextField, Typography, withStyles} from "@material-ui/core";
import PropTypes from 'prop-types';
import React, {useState} from "react";
import {graphql} from "react-apollo/graphql";
import {NotificationManager} from "react-notifications";
import {UPLOAD_MODEL} from '../../domain/data-queries';

type State = {
    model_name: string,
    file: null,
    validity: null,
    benchmarks_jobs: Array<Object>,
    loading: boolean,
};

const UploadFormContainer = withStyles(theme => ({
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

function UploadFormComponent({mutate, model_upload_instructions_url}) {

    let state: State;
    let setState: Function;

    [state, setState] = useState({
        model_name: new Date().toISOString(),
        file: null,
        validity: false,
        benchmarks_jobs: [],
        loading: false,
    });

    const upload_model = async () => {
        const {file, validity, model_name} = state;
        if (validity.valid) {
            try {
                setState({...state, loading: true});
                await mutate({
                    variables: {file, model_name}
                });
            } catch (e) {
                console.log(e);
                NotificationManager.error(`there was an error: ${e.message}. please try again later.`);
                setState({...state, loading: false});
            }

        }
    };

    const upload_is_valid = () => {
        return state.model_name.length > 0 && state.validity.valid;
    };

    const file_changed = ({target: {validity, files: [file]}}) => {
        setState({...state, file, validity});
    };

    const change_value = name => event => {
        this.setState({...state, [name]: event.target.value});
    };

    return (
        <UploadFormContainer>
            <TextField
                required
                value={state.model_name}
                onChange={change_value('model_name')}/>
            <input
                required
                type='file'
                onChange={file_changed}/>
            <Button
                onClick={upload_model}
                disabled={!upload_is_valid()}>Upload</Button>
            <Link
                target='_blank'
                href={model_upload_instructions_url}>
                Click here for instructions on how to prepare your model for upload.
            </Link>
            {state.loading && (
                <React.Fragment>
                    <Typography variant='body1' display='inline'>Uploading...</Typography>
                    <CircularProgress/>
                </React.Fragment>
            )}
        </UploadFormContainer>
    );
}

UploadFormComponent.propTypes = {
    mutate: PropTypes.func.isRequired,
    model_upload_instructions_url: PropTypes.string.isRequired,
};

export const UploadForm = graphql(UPLOAD_MODEL)(UploadFormComponent);
