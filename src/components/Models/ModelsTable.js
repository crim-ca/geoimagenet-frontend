// @flow

import PlayArrow from "@material-ui/icons/PlayArrow";
import MaterialTable from "material-table";
import {tableIcons} from "../../utils/react";
import PropTypes from "prop-types";
import {compose} from "react-apollo";
import {graphql} from "react-apollo/graphql";
import React from "react";
import {MODELS, LAUNCH_TEST_JOB} from '../../domain/data-queries';
import {NotificationManager} from "react-notifications";

const make_play_arrow = () => <PlayArrow/>;

function ModelsTableFunction({data: {models, refetch}, mutate}) {

    const launch_job_handler = async (event, rowData) => {
        let result;
        try {
            result = await mutate({
                variables: {
                    model_id: rowData.id
                }
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
        await refetch();
    };

    return (
        <MaterialTable
            actions={[
                {
                    icon: make_play_arrow,
                    tooltip: 'Launch Tests',
                    onClick: launch_job_handler
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

ModelsTableFunction.propTypes = {
    data: PropTypes.object.isRequired,
    mutate: PropTypes.func.isRequired,
};
export const ModelsTable = compose(
    graphql(MODELS),
    graphql(LAUNCH_TEST_JOB)
)(ModelsTableFunction);