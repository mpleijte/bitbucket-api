import { Properties } from "ts-json-properties";
import {BitbucketProperties} from "./data-structs";
Properties.initialize("./resources/prod/properties.json");

const request = require("request-promise");
export class Bitbucket {

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
}


class Property {

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