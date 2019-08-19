// @flow strict

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
