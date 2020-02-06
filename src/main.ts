import { Bitbucket, BitbucketProperties, RepositoryProperty } from "./index";
import { Properties, Value } from "ts-json-properties/lib";

const request = require("request-promise");
Properties.initialize("./resources/prod/properties.json");
const bb = new Bitbucket();

type repoObject = {
  size: number;
  limit: number;
  isLastPage: boolean;
  nextPageStart: number;
  values: [
    {
      slug: string;
      id: number;
      name: string;
      description: string;
      scmId: string;
      state: string;
      statusMessage: string;
      forkable: boolean;
      project: string[];
      public: false;
      links: string[];
    }
  ];
  start: number;
};

const myMap = new Map();
export async function getAllRepositories(properties: BitbucketProperties) {

  let repositoriesObject: Promise<repoObject> = getSubsetRepositories(
    properties
  );
  await repositoriesObject.then(repositories => {
    if (!repositories.isLastPage) {
      properties.repos.limit = repositories.nextPageStart + repositories.size;
      properties.repos.start = repositories.nextPageStart;

      for (const val of repositories.values) {
        const repo = {
          "slug": val.slug,
          "description": val.description,
          branches: {}
        };
        myMap.set(repo, val.id);
      }
      return getAllRepositories(properties);

    } else {

      for (const val of repositories.values) {
        const repo = {
          "slug": val.slug,
          "description": val.description,
          branches: {}
        }
        myMap.set(repo, val.id);

      myMap.forEach(function(v, k) {
          console.log(`k: ${JSON.stringify(k)})`);
          console.log(v);
        });
      }
  }});
}


export async function getSubsetRepositories(properties: BitbucketProperties) {
  const repos: Promise<any> = bb.getRepositories(properties);
  return repos;
}

export async function getRepos(properties: BitbucketProperties) {
  const bb = new Bitbucket();
  const repos: Promise<any> = bb.getRepositories(properties);
  return repos;
}

export async function main() {
  const host = Properties.get("host");
  const authorization = Properties.get("authorization");

  const properties: BitbucketProperties = {
    host: host,
    authorization: authorization,
    repos: {
      path: "rest/api/1.0/projects",
      project: "ECOM",
      start: 0,
      limit: 20
    }
  };

  getAllRepositories(properties);
}

main();
