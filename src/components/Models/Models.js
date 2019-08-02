// @flow

import React, {Component} from 'react';
import {withStyles} from '@material-ui/core';
import {ModelsTable} from './ModelsTable';
import {UploadForm} from './UploadForm';
import {BenchmarksTable} from './BenchmarksTable';

const Grid = withStyles(({values}) => ({
    root: {
        display: 'grid',
        gridTemplateColumns: '1fr max-content 1fr',
        gridTemplateRows: 'min-content',
    },
    content: {
        gridColumn: '2/3',
        display: 'grid',
        gridTemplateRows: 'min-content',
        gridGap: values.gutterSmall,
    }
}))(({classes: {root, content}, children}) => (
    <div className={root}>
        <div className={content}>{children}</div>
    </div>
));

type Props = {
    model_upload_instructions_url: string,
};

export class Models extends Component<Props> {

    render() {
        return (
            <Grid>
                <UploadForm model_upload_instructions_url={this.props.model_upload_instructions_url} />
                <ModelsTable />
                <BenchmarksTable />
            </Grid>
        );
    }
}
