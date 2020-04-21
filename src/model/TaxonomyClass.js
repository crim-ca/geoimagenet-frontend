// @flow strict

import type { Counts } from '../Types';

/**
 * This is the basic unit of annotation for machine learning: the class.
 * An class represents a thing that we want our model to recognize at some point.
 * We have properties stored in distant storage, as well as some other ones that represent the state of said taxonomy class within our application.
 */
export class TaxonomyClass {

  id: number;

  name_fr: string;

  name_en: string;

  taxonomy_id: number;

  parent_id: number | null;

  children: TaxonomyClass[];

  /**
   * The visible property controls whether or not annotations, counts and any related information about that specific class are to be displayed.
   * There are a priori no exceptions to this rule, if anything anywhere is to be shown on the screen about a class, it should appear or not based on this property.
   */
  visible: boolean;

  /**
   * In contrast to the visible property, the opened one is about the display of a class's children in the taxonomies and classes section of the sidebar
   */
  opened: boolean;

  /**
   * Being "pinned" in the context of an annotation class is being present in the "workspace" of the annotation browser.
   * Pinned classes are present in a second screen where only pinned classes are present, so that the user can see a limited amount of information at the same time.
   */
  pinned: boolean;

  counts: Counts;

  /**
   * We only need four params from the api to make sure we have a class that will behave correctly in the application.
   * All others can be added after instantiation if they happen to exist.
   */
  constructor(
    id: number,
    name_fr: string,
    name_en: string,
    taxonomy_id: number,
    parent_id: number | null = null,
    children: TaxonomyClass[] = [],
    visible: boolean = false,
    opened: boolean = false,
    pinned: boolean = false,
    counts: Counts = {}
  ) {
    this.id = id;
    this.name_fr = name_fr;
    this.name_en = name_en;
    this.taxonomy_id = taxonomy_id;
    this.parent_id = parent_id;
    this.children = children;
    this.visible = visible;
    this.opened = opened;
    this.pinned = pinned;
    this.counts = counts;
  }
}
