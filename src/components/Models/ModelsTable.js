// @flow

import PlayArrow from "@material-ui/icons/PlayArrow";
import MaterialTable from "material-table";
import {tableIcons} from "../../utils/react";
import {compose} from "react-apollo";
import {graphql} from "react-apollo/graphql";
import React from "react";
import {MODELS, LAUNCH_TEST_JOB} from '../../domain/data-queries';
import {NotificationManager} from "react-notifications";

const make_play_arrow = () => <PlayArrow />;

type Props = {
    data: {
        models: {}
    },
    mutate: Function,
};

class ModelsTableComponent extends React.Component<Props> {

    launch_job_handler = async (event, rowData) => {
        const {mutate} = this.props;
        let result;
        try {
            result = await mutate({
                variables: {
                    model_id: rowData.id
                },
                update: (cache, {data: {upload_model: {model}}}) => {
                    const {models} = cache.readQuery({query: MODELS});
                    cache.writeQuery({
                        query: MODELS,
                        data: {models: models.concat([model])},
                    });
                },
            });
        } catch (e) {
            NotificationManager.error('We were unable to launch the model testing job.');
            throw e;
        }
        const {data: {launch_test: {message, success}}} = result;
        if (success) {
            NotificationManager.success('Model testing was launched.');
        } else {
            NotificationManager.error(message);
        }
    };

    render() {
        const {data: {models}} = this.props;
        return (
            <MaterialTable
                actions={[
                    {
                        icon: make_play_arrow,
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
                data={models}
            />
        );
    }
}

export const ModelsTable = compose(
    graphql(MODELS),
    graphql(LAUNCH_TEST_JOB)
)(ModelsTableComponent);