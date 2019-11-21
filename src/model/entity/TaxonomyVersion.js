// @flow strict

/**
 * Taxonomies evolve in time; a taxonomy version groups all classes that correspond to a taxonomy at a point in time.
 */
export class TaxonomyVersion {
  taxonomy_id: number;

  root_taxonomy_class_id: number;

  version: string;

  constructor(taxonomy_id: number, root_taxonomy_class_id: number, version: string) {

    this.taxonomy_id = taxonomy_id;
    this.root_taxonomy_class_id = root_taxonomy_class_id;
    this.version = version;
  }
}
