import {Bitbucket} from "./bitbucket";
import {BitbucketProperties, repoObject} from "./data-structs";

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
          slug: val.slug,
          description: val.description,
          branches: {}
        };
        myMap.set(repo, val.id);
      }
      return getAllRepositories(properties);
    } else {
      for (const val of repositories.values) {
        const repo = {
          slug: val.slug,
          description: val.description,
          branches: {}
        };
        myMap.set(repo, val.id);

        myMap.forEach(function(v, k) {
          console.log(`k: ${JSON.stringify(k)})`);
          console.log(v);
        });
      }
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

const bb = new Bitbucket();
getAllRepositories(bb.property).then( x => {

}).catch( e => {

});
