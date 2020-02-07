import {BitbucketProperties, repoDomainObject, repoObject} from "./data-structs";
import {Bitbucket} from "./bitbucket";

export class Repositories {

    bb: Bitbucket;

    constructor(bitbucketObj: Bitbucket) {
        this.bb = bitbucketObj;
    }

    async getAllRepositories(properties: BitbucketProperties): Promise<Map<repoDomainObject, string>> {
        let repositoriesObject: Promise<repoObject> = this.bb.getRepositories(properties);
        await repositoriesObject.then(repositories => {
            if (!repositories.isLastPage) {
                properties.repos.limit = repositories.nextPageStart + repositories.size;
                properties.repos.start = repositories.nextPageStart;

                for (const val of repositories.values) {
                    const repo = {
                        "id": val.id,
                        "slug": val.slug,
                        "description": val.description,
                        "branches": {}
                    };
                    this.bb.myMap.set(repo, val.slug);
                }
                return this.getAllRepositories(properties);
            } else {
                for (const val of repositories.values) {
                    const repo = {
                        "id": val.id,
                        "slug": val.slug,
                        "description": val.description,
                        "branches": {}
                    };
                    this.bb.myMap.set(repo, val.slug);
                }
            }
        });
        return this.bb.myMap;
    }

}
