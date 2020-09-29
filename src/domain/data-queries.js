// @flow strict

import { make_http_request, post_json, put_json } from '../utils/http';
import { SatelliteImage } from '../model/entity/SatelliteImage';
import type { FollowedUser, MagpieMergedSessionInformation } from '../Types';

/**
 * Here we find all the actual requests for data from the api.
 * @todo refactor http utilities as their class to inject them here.
 */
export class DataQueries {
  geoimagenet_api_endpoint: string;

  geoserver_endpoint: string;

  magpie_endpoint: string;

  ml_endpoint: string;

  constructor(geoimagenet_api_url: string, geoserver_endpoint: string, magpie_endpoint: string, ml_endpoint: string) {
    this.geoimagenet_api_endpoint = geoimagenet_api_url;
    this.geoserver_endpoint = geoserver_endpoint;
    this.magpie_endpoint = magpie_endpoint;
    this.ml_endpoint = ml_endpoint;
  }

  get_annotations_browser_page = async (type_name: string, cqlFilter: string, page_size: string, offset: string) => {
    let url = `${this.geoserver_endpoint}/wfs?service=WFS&`
      + `version=1.1.0&request=GetFeature&typeName=${type_name}&`
      + 'outputFormat=application/json&srsname=EPSG:3857&';
    if (cqlFilter.length > 0) {
      url += cqlFilter;
    }
    url += `&maxfeatures=${page_size}&startindex=${offset}`;
    const response = await make_http_request(url);
    return await response.json();
  };

  fetch_images_dictionary = async () => {
    const response = await make_http_request(`${this.geoimagenet_api_endpoint}/images`);
    const images = await response.json();
    return images.map((raw) => new SatelliteImage(raw.bands, raw.bits, raw.extension, raw.filename, raw.id, raw.layer_name, raw.sensor_name));
  };

  persistFollowedUser = (
    formData: FollowedUser[],
  ): Promise<Response> => post_json(
    `${this.geoimagenet_api_endpoint}/users/current/followed_users`,
    JSON.stringify(formData),
  );

  fetch_followed_users = async (): Promise<FollowedUser[]> => {
    const response: Response = await make_http_request(`${this.geoimagenet_api_endpoint}/users/current/followed_users`);
    return response.json();
  };

  remove_followed_user = async (id: number): Promise<Response> => make_http_request(`${this.geoimagenet_api_endpoint}/users/current/followed_users/${id}`, {
    method: 'delete',
    headers: {
      'Content-Type': 'application/json',
    },
  });


  /**
   * we overwrite the return for the first element because this method is called get by id, we only ever want one element
   */
  get_annotation_by_id = async (id: number, typename: string) => {
    const url = `${this.geoserver_endpoint}/wfs?service=WFS&version=1.1.0&request=GetFeature`
      + `&typeName=${typename}&outputFormat=application/json&srsname=EPSG:3857&cql_filter=id=${id}`;
    const response = await make_http_request(url);
    const json = await response.json();
    return json.features[0];
  };

  /**
   * Returns a GeoJson FeatureCollection with the images that contain a specific wkt geometry
   */
  get_annotation_images = async (wktFeature: string) => {
    const url = `${this.geoserver_endpoint}/wfs?service=WFS&`
      + 'exceptions=application/json&'
      + 'request=GetFeature&'
      + 'typeNames=GeoImageNet:image&'
      + 'outputFormat=application/json&'
      + 'srsName=EPSG:3857&'
      + 'propertyName=id,layer_name&'
      + `cql_filter=CONTAINS(trace_simplified, ${wktFeature}) AND bands IN ('RGB', 'NRG') AND bits=8`;

    const response = await make_http_request(url);
    return await response.json();
  };

  logout_request() {
    return make_http_request(`${this.magpie_endpoint}/signout`);
  }

  login_request(form_data: {}) {
    const payload = JSON.stringify(form_data);
    return post_json(`${this.magpie_endpoint}/signin`, payload);
  }

  change_password_request = (new_password: string): Promise<Response> => {
    return make_http_request(`${this.magpie_endpoint}/users/current`, {
      method: "PUT",
      data: {
        password: new_password,
      }
    })
  };

  /**
   * Launches the dataset creation task through the geoimagenet api, that will in turn call the machine learning api.
   */
  launch_dataset_creation = (dataset_name: string, taxonomy_id: number) => {
    const payload = JSON.stringify({
      name: dataset_name,
      taxonomy_id: taxonomy_id,
    });
    return post_json(`${this.geoimagenet_api_endpoint}/batches`, payload);
  };

  /**
   * Returns information for the user associated with current cookies. We rely on the cookies being automatically associated
   * to requests here. This is fairly usual behaviour.
   * Added the merging of two requests because they both have only part of the needed information: session knows if we're authenticated or not,
   * but users/current will happily return an user object even for not-logged users (the famed anonymous user).
   * @todo as we are coupled to the idea that there is an actual user that is anonymous, we could add test around this boundary
   */
  current_user_session = async (): Promise<MagpieMergedSessionInformation> => {
    const responses = await Promise.all([
      make_http_request(`${this.magpie_endpoint}/users/current`),
      make_http_request(`${this.magpie_endpoint}/session`),
    ]);
    const jsons = await Promise.all(responses.map((res) => res.json()));
    const merged_information = {};
    jsons.forEach((json) => {
      if (json.code === 200) {
        Object.assign(merged_information, json);
      } else {
        throw new Error('We could not interrogate magpie for user information.');
      }
    });
    return merged_information;
  };

  /**
   * Fetches the permissions for the logged user and specified service name. We hardcode the inherit=true parameter because so far
   * there is no case where we don't want all of the permissions.
   * @param {String} service_name
   * @returns {Promise<String>}
   */
  current_user_permissions = async (service_name: string) => {
    const res = await make_http_request(`${this.magpie_endpoint}/users/current/services/${service_name}/resources?inherit=true`);
    return res.json();
  };

  /**
   * Releases annotations for a given taxonomy class
   * @param {number} taxonomy_id
   * @returns {Promise<*>}
   */
  release_annotations_by_taxonomy_request = (taxonomy_class_id: number) => {
    const payload = JSON.stringify({
      taxonomy_class_id: taxonomy_class_id,
    });
    return post_json(`${this.geoimagenet_api_endpoint}/annotations/release`, payload);
  };

  /**
   * Releases annotations by annotation ids
   * @param {Number[]} annotation_ids
   * @returns {Promise<*>}
   */
  release_annotations_by_id_request = (annotation_ids: number[]) => {
    const payload = JSON.stringify({
      annotation_ids: annotation_ids,
    });
    return post_json(`${this.geoimagenet_api_endpoint}/annotations/release`, payload);
  };

  /**
   * Call after validating with the user that they really want to release annotations. This will release all annotations
   * of all children of the taxnomy class, if any.
   * @param {Number[]} annotation_ids
   * @returns {Promise<*>}
   */
  validate_annotations_request = (annotation_ids: number[]) => {
    const payload = JSON.stringify({
      annotation_ids: annotation_ids,
    });
    return post_json(`${this.geoimagenet_api_endpoint}/annotations/validate`, payload);
  };

  reject_annotations_request = (annotation_ids: number[]) => {
    const payload = JSON.stringify({
      annotation_ids: annotation_ids,
    });
    return post_json(`${this.geoimagenet_api_endpoint}/annotations/reject`, payload);
  };

  delete_annotations_request = (annotation_ids: number[]) => {
    const payload = JSON.stringify({
      annotation_ids: annotation_ids,
    });
    return post_json(`${this.geoimagenet_api_endpoint}/annotations/delete`, payload);
  };

  fetch_taxonomies = async () => {
    const res = await make_http_request(`${this.geoimagenet_api_endpoint}/taxonomy`);
    return res.json();
  };

  /**
   * Fetch the taxonomy classes in a nested data structure to represent the nested tree we can see in the UI.
   */
  fetch_taxonomy_classes = async () => {
    const res = await make_http_request(`${this.geoimagenet_api_endpoint}/taxonomy_classes`);
    return res.json();
  };

  flat_taxonomy_classes_counts = async (root_taxonomy_class_id: number) => {
    const res = await make_http_request(`${this.geoimagenet_api_endpoint}/annotations/counts/${root_taxonomy_class_id}`);
    return res.json();
  };

  create_geojson_feature = async (payload: string) => {
    const res = await post_json(`${this.geoimagenet_api_endpoint}/annotations`, payload);
    return res.json();
  };

  modify_geojson_features = async (payload: string) => put_json(`${this.geoimagenet_api_endpoint}/annotations`, payload);

  review_request = async (feature_ids: Array<number>, review_requested: boolean) => {
    const payload = JSON.stringify({
      annotation_ids: feature_ids,
      boolean: review_requested,
    });
    return post_json(`${this.geoimagenet_api_endpoint}/annotations/request_review`, payload);
  };
}
