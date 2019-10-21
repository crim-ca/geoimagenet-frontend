// @flow strict
import MaterialTable from "material-table";
import {graphql, compose} from 'react-apollo';
import {tableIcons} from "../../utils/react";
import PropTypes from 'prop-types';
import React from "react";
import {DATASET_CREATION_JOBS, LAUNCH_DATASET_CREATION_JOB} from '../../domain/graphql_queries';
import {Button} from "@material-ui/core";
import {NotificationManager} from "react-notifications";

function DatasetCreationJobsTableComponent({data: {jobs, refetch}, mutate}) {

    const launch_dataset_creation = async () => {
        let result;
        try {
            result = await mutate();
        } catch (e) {
            NotificationManager.error('We were unable to start the dataset creation job.');
            throw e;
        }
        const {data: {launch_dataset_creation_job: {success, message}}} = result;
        if (!success) {
            NotificationManager.error(message);
            return;
        }
        await refetch();
    };

    return (
        <React.Fragment>
            <Button onClick={launch_dataset_creation}
                    variant='contained'
                    color='primary'>
                Create Patches
            </Button>
            <MaterialTable
                title='Dataset creation jobs'
                icons={tableIcons}
                columns={[
                    {title: 'ID', field: 'id'},
                    {title: 'Status', field: 'status'},
                    {title: 'Message', field: 'status_message'},
                    {title: 'Progress', field: 'progress'},
                ]}
                data={jobs}
            />
        </React.Fragment>

    );
}

DatasetCreationJobsTableComponent.propTypes = {
    data: PropTypes.object.isRequired,
    mutate: PropTypes.func.isRequired,
};

export const DatasetCreationJobsTable = compose(
    graphql(DATASET_CREATION_JOBS),
    graphql(LAUNCH_DATASET_CREATION_JOB),
)(DatasetCreationJobsTableComponent);
