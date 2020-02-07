import { Properties } from "ts-json-properties";
import {BitbucketProperties, repoObject} from "./data-structs";
Properties.initialize("./resources/prod/properties.json");

const request = require("request-promise");
export class Bitbucket {
  myMap = new Map();

  public property: BitbucketProperties;

  constructor() {
    this.property = Property.createDefaultProperties();
  }

  async getRepositories(property: BitbucketProperties): Promise<any> {
    const HOST = property.host;
    const AUTH = property.authorization;
    const PATH = property.repos.path;
    const PROJECT = property.repos.project;
    const START = property.repos.start;
    const LIMIT = property.repos.limit;

    return request({
      method: "GET",
      uri: `${HOST}/${PATH}/${PROJECT}/repos?start=${START}&limit=${LIMIT}`,
      json: true,
      headers: {
        "Content-Type": "application/json",
        Authorization: `${AUTH}`
      }
    });
  }

  async getSubsetRepositories(properties: BitbucketProperties) {
    const repos: Promise<any> = this.getRepositories(properties);
    return repos;
  }

  async getRepos(properties: BitbucketProperties) {
    const bb = new Bitbucket();
    const repos: Promise<any> = this.getRepositories(properties);
    return repos;
  }

  async getAllRepositories(properties: BitbucketProperties): Promise<Map<number, Object>> {
    let repositoriesObject: Promise<repoObject> = this.getSubsetRepositories(
        properties
    );
    await repositoriesObject.then(repositories => {
      if (!repositories.isLastPage) {
        properties.repos.limit = repositories.nextPageStart + repositories.size;
        properties.repos.start = repositories.nextPageStart;

        for (const val of repositories.values) {
          const repo = {
            slug: val.slug,
            description: val.description,
            branches: {}
          };
          this.myMap.set(repo, val.id);
        }
        return this.getAllRepositories(properties);
      } else {
        for (const val of repositories.values) {
          const repo = {
            slug: val.slug,
            description: val.description,
            branches: {}
          };
          this.myMap.set(repo, val.id);
        }
      }
    });
    return this.myMap;
  }


} // END BITBUCKET CLASS


export class Property {
  public static createDefaultProperties(): BitbucketProperties {
    return {
      host: Properties.get("host"),
      authorization: Properties.get("authorization"),
      repos: {
        path: "rest/api/1.0/projects",
        project: "ECOM",
        start: 0,
        limit: 20
      }
    };
  }
}





