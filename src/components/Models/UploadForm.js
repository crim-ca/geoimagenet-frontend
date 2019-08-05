// @flow

import {Button, CircularProgress, Link, TextField, Typography, withStyles} from "@material-ui/core";
import PropTypes from 'prop-types';
import React from "react";
import {graphql} from "react-apollo/graphql";
import {NotificationManager} from "react-notifications";
import {UPLOAD_MODEL} from '../../domain/graphql_queries';

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

type Props = {
    mutate: Function,
    model_upload_instructions_url: string,
};

class UploadFormComponent extends React.Component<Props, State> {

    state = {
        model_name: new Date().toISOString(),
        file: null,
        validity: false,
        benchmarks_jobs: [],
        loading: false,
    };


    upload_model = async () => {
        const {file, validity, model_name} = this.state;
        const {mutate} = this.props;
        let result;
        if (validity.valid) {
            try {
                await this.setState({loading: true});
                result = await mutate({
                    variables: {file, model_name},
                    update: () => {
                        console.log('in updateing...');
                    },
                });
                this.setState({file: null, validity: false, loading: false});
            } catch (e) {
                console.log(e);
                NotificationManager.error(`there was an error: ${e.message}. please try again later.`);
            }

            this.setState({loading: false});

            const {data: {upload_model: {message, success}}} = result;
            if (success) {
                NotificationManager.success('Model testing was launched.');
            } else {
                NotificationManager.error(message);
            }

        }
    };

    upload_is_valid = () => {
        const {model_name, validity} = this.state;
        return model_name.length > 0 && validity.valid;
    };

    file_changed = ({target: {validity, files: [file]}}) => {
        this.setState({file, validity});
    };

    change_value = name => event => {
        this.setState({[name]: event.target.value});
    };

    render() {
        const {model_name, loading} = this.state;
        const {model_upload_instructions_url} = this.props;
        return (
            <UploadFormContainer>
                <TextField
                    required
                    value={model_name}
                    onChange={this.change_value('model_name')} />
                <input
                    required
                    type='file'
                    onChange={this.file_changed} />
                <Button
                    onClick={this.upload_model}
                    disabled={!this.upload_is_valid()}>Upload</Button>
                <Link
                    target='_blank'
                    href={model_upload_instructions_url}>
                    Click here for instructions on how to prepare your model for upload.
                </Link>
                {loading && (
                    <React.Fragment>
                        <Typography variant='body1' display='inline'>Uploading...</Typography>
                        <CircularProgress />
                    </React.Fragment>
                )}
            </UploadFormContainer>
        );
    }
}

UploadFormComponent.propTypes = {
    mutate: PropTypes.func.isRequired,
    model_upload_instructions_url: PropTypes.string.isRequired,
};

export const UploadForm = graphql(UPLOAD_MODEL)(UploadFormComponent);
