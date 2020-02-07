export interface RepositoryProperties {
  path: string; // endpoint path
  project: string; // bitbucket project name
  start: number; // list repositories from: start
  limit: number; // list repositories until
  // : limit, maximum is 100 respositories in one GET call
}

export interface BitbucketProperties {
  host: string;
  authorization: string;
  repos: RepositoryProperties;
}

export type repoObject = {
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