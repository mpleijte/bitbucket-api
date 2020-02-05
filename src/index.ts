const request = require("request-promise");

export interface RepositoryProperty {
  path: string; // endpoint path
  project: string; // bitbucket project name
  start: number; // list repositories from: start
  limit: number; // list repositories until
  // : limit, maximum is 100 respositories in one GET call
}

export interface BitbucketProperties {
  host: string;
  authorization: string;
  repos: RepositoryProperty;
}

export class Bitbucket {
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
