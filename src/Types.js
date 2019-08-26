// @flow strict

import {AnnotationStatusFilter} from "./domain/entities";

export type TaxonomyClassFromAPI = {
    children: TaxonomyClassFromAPI[],
    code: string,
    id: number,
    name_en: string,
    name_fr: string,
    taxonomy_id: number,
};
export type TaxonomyClassesDataFromAPI = TaxonomyClassFromAPI[];

export type AnnotationStatus = 'new' | 'pre_released' | 'released' | 'validated' | 'rejected' | 'deleted';

export type AnnotationStatusList = {
    'new': AnnotationStatusFilter,
    'pre_released': AnnotationStatusFilter,
    'released': AnnotationStatusFilter,
    'validated': AnnotationStatusFilter,
    'rejected': AnnotationStatusFilter,
    'deleted': AnnotationStatusFilter,
};

export type Counts = {
    'new': number,
    'pre_released': number,
    'released': number,
    'validated': number,
    'rejected': number,
    'deleted': number,
};
