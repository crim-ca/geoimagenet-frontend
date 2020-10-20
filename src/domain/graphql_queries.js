// @flow strict

import gql from 'graphql-tag';

export const MODELS = gql`
    query models {
        models {
            id
            name
            path
            created
        }
    }
`;

export const DATASETS = gql`
    query datasets {
        datasets(status: finished) {
            id
            name
            classes_count
            annotations_count
            created
        }
    }
`;

export const PUBLIC_BENCHMARKS = gql`
    query fetch_jobs {
        public_benchmarks {
            owner
            model {
                id
                created
            }
            result {
                metrics {
                    top_1_accuracy
                    top_5_accuracy
                    mIoU
                }
            }
            dataset {
                id
            }
            job {
                finished
            }
        }
    }
`;

export const UPLOAD_MODEL = gql`
    mutation upload_model($file: Upload!, $model_name: String!) {
        upload_model(model_name: $model_name, file: $file) {
            success
            message
            model {
                name
            }
        }
    }
`;

export const LAUNCH_TEST_JOB = gql`
    mutation launch_test_job($model_id: ID!) {
        launch_test(model_id: $model_id) {
            success
            message
            job {
                id
                status
                progress
                status_message
                visibility
            }
        }
    }
`;

export const LAUNCH_DATASET_CREATION_JOB = gql`
    mutation batch {
        launch_dataset_creation_job {
            success
            message
        }
    }
`;

export const BENCHMARKS_JOBS = gql`
    query fetch_jobs {
        jobs(process_id: "model-tester") {
            id
            status
            progress
            status_message
            visibility
        }
    }
`;

export const DATASET_CREATION_JOBS = gql`
    query jobs {
        jobs(process_id: "batch-creation") {
            id
            status
            status_message
            progress
        }
    }
`;

export const CHANGE_BENCHMARK_VISIBILITY = gql`
    mutation change_visibility($job_id: ID!, $visibility: Visibility!) {
        benchmark_visibility(job_id: $job_id, visibility: $visibility) {
            success
            message
        }
    }
`;
