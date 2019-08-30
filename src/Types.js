// @flow strict

import {AnnotationStatusFilter, TaxonomyClass} from "./domain/entities";

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

export type ContextualMenuItem = {
    text: string,
    value: string,
};
export type PopulateContextualMenuCallback = (ContextualMenuItem[], () => void, () => void) => Promise<void>;

export type TaxonomyClassToggleFunction = (TaxonomyClass, ?boolean) => void;

export type MagpieMergedSessionInformation = {
    authenticated: boolean,
    code: number,
    detail: string,
    type: string,
    user: {
        email: string,
        group_names: string[],
        user_id: number,
        user_name: string
    },
};
