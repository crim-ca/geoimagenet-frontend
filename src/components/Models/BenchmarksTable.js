// @flow

import {tableIcons} from "../../utils/react";
import Publish from '@material-ui/icons/Publish';
import Lock from '@material-ui/icons/Lock';
import MaterialTable from "material-table";
import {compose} from "react-apollo";
import graphql from "react-apollo/graphql";
import React from "react";
import {BENCHMARKS_JOBS, CHANGE_BENCHMARK_VISIBILITY} from "../../domain/data-queries";
import {NotificationManager} from "react-notifications";
import PropTypes from "prop-types";

const make_publish_icon = () => <Publish/>;
const make_lock_icon = () => <Lock/>;

function BenchmarksTableComponent({data: {jobs, refetch}, mutate}) {

    const benchmark_visibility_handler = (job_id, visibility) => async () => {
        let result;
        try {
            result = await mutate({
                variables: {
                    job_id: job_id,
                    visibility: visibility,
                }
            });
        } catch (e) {
            NotificationManager.error('There was a problem with the visibility change request.');
            throw e;
        }
        const {data: {benchmark_visibility: {success, message}}} = result;
        if (success) {
            NotificationManager.success('Benchmark visibility updated.');
        } else {
            NotificationManager.error(message);
        }
        refetch();
    };


    return (
        <MaterialTable
            title='Benchmarks jobs'
            icons={tableIcons}
            actions={[
                rowData => ({
                    icon: make_publish_icon,
                    tooltip: 'publish',
                    onClick: benchmark_visibility_handler(rowData.id, 'public'),
                    disabled: rowData.visibility === 'public',
                }),
                rowData => ({
                    icon: make_lock_icon,
                    tooltip: 'unpublish',
                    onClick: benchmark_visibility_handler(rowData.id, 'private'),
                    disabled: rowData.visibility === 'private',
                }),
            ]}
            columns={[
                {title: 'ID', field: 'id'},
                {title: 'Visibility', field: 'visibility'},
                {title: 'Status', field: 'status'},
                {title: 'Message', field: 'status_location'},
                {title: 'Progress', field: 'progress'},
            ]}
            data={jobs}
        />
    );
}


BenchmarksTableComponent.propTypes = {
    data: PropTypes.object.isRequired,
    mutate: PropTypes.func.isRequired,
};

export const BenchmarksTable = compose(
    graphql(BENCHMARKS_JOBS),
    graphql(CHANGE_BENCHMARK_VISIBILITY),
)(BenchmarksTableComponent);
