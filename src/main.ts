import { Bitbucket, BitbucketProperties, RepositoryProperty } from "./index";

const request = require("request-promise");

import { Properties, Value } from "ts-json-properties/lib";
Properties.initialize("./resources/prod/properties.json");

const bb = new Bitbucket();

/*
const getSentence = (offset = 0) => {
  const fragment = getSentenceFragment(offset);
  if (fragment.nextPage) {
    return fragment.data.concat(getSentence(fragment.nextPage));
  } else {
    return fragment.data;
  }
}
 */

const arr: object[] = [];
export async function getAllRepositories(properties: BitbucketProperties) {
  let repositoriesObject: Promise<any> = getSubsetRepositories(properties);
  await repositoriesObject.then(repositories => {
    if (!repositories.isLastPage) {
      arr.push(repositories);
      properties.repos.limit = repositories.nextPageStart + repositories.size;
      properties.repos.start = repositories.nextPageStart;
      console.log(`properties.repos.start: ${properties.repos.start}`);
      console.log(`properties.repos.limit: ${properties.repos.limit}`);
      // console.log(repositories);
      // return repositoriesObject = getAllRepositories(properties);
      // repositoriesObject.concat(getAllRepositories(properties));
      return getAllRepositories(properties);
    } else {
      arr.push(repositories);
      // console.log(repositories);
      console.log(`arr.size: ${arr.length}`);
      console.log(arr[0]);
      console.log(
        "============================================================="
      );
      console.log(arr[1]);
    }
  });
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

export async function showRepos(repos: Promise<any>) {
  console.log("SP0");
  await repos
    .then(response => {
      console.log(response);
    })
    .catch(err => {
      console.log(err);
    });
  console.log("SP2");
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

  // const repos: Promise<any> = getRepos(properties);
  // showRepos(repos);

  getAllRepositories(properties);
}

main();
