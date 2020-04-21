// @flow strict

import { TaxonomyVersion } from './TaxonomyVersion';

/**
 * A taxonomy is an ensemble of TaxonomyClass that represents a specific field or subset of a field.
 */
export class Taxonomy {
  name_fr: string;

  name_en: string;

  slug: string;

  versions: TaxonomyVersion[];

  constructor(name_fr: string, name_en: string, slug: string, versions: TaxonomyVersion[]) {

    this.name_fr = name_fr;
    this.name_en = name_en;
    this.slug = slug;
    this.versions = versions;
  }
}
