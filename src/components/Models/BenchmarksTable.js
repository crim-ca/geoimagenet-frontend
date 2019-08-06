// @flow

import {tableIcons} from "../../utils/react";
import Publish from '@material-ui/icons/Publish';
import Lock from '@material-ui/icons/Lock';
import MaterialTable from "material-table";
import {compose} from "react-apollo";
import {graphql} from "react-apollo/graphql";
import React from "react";
import {BENCHMARKS_JOBS, CHANGE_BENCHMARK_VISIBILITY} from "../../domain/graphql_queries";
import {NotificationManager} from "react-notifications";

const make_publish_icon = () => <Publish />;
const make_lock_icon = () => <Lock />;

type Props = {
    data: {
        jobs: Array<Object>,
        refetch: Function,
        startPolling: Function,
        stopPolling: Function,
    },
    mutate: Function
};

class BenchmarksTableComponent extends React.Component<Props> {

    benchmark_visibility_handler = (job_id, visibility) => async () => {
        const {data: {refetch}} = this.props;
        let result;
        try {
            result = await this.props.mutate({
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

    pending_jobs() {
        const {data: {jobs}} = this.props;
        if (!jobs) {
            return false;
        }
        return jobs.some(job => job.status === 'running' || job.status === 'accepted');
    }

    render() {
        const {data: {jobs, startPolling, stopPolling}} = this.props;
        if (this.pending_jobs()) {
            startPolling(5 * 1000);
        } else {
            stopPolling();
        }
        return (
            <MaterialTable
                title='Benchmarks jobs'
                icons={tableIcons}
                actions={[
                    rowData => ({
                        icon: make_publish_icon,
                        tooltip: 'publish',
                        onClick: this.benchmark_visibility_handler(rowData.id, 'public'),
                        disabled: rowData.visibility === 'public',
                    }),
                    rowData => ({
                        icon: make_lock_icon,
                        tooltip: 'unpublish',
                        onClick: this.benchmark_visibility_handler(rowData.id, 'private'),
                        disabled: rowData.visibility === 'private',
                    }),
                ]}
                columns={[
                    {title: 'ID', field: 'id'},
                    {title: 'Visibility', field: 'visibility'},
                    {title: 'Status', field: 'status'},
                    {title: 'Message', field: 'status_message'},
                    {title: 'Progress', field: 'progress'},
                ]}
                data={jobs}
            />
        );
    }
}

export const BenchmarksTable = compose(
    graphql(BENCHMARKS_JOBS),
    graphql(CHANGE_BENCHMARK_VISIBILITY),
)(BenchmarksTableComponent);
