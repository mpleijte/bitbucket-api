import {Bitbucket, Property} from "./lib/bitbucket";
import {BitbucketProperties} from "./lib/data-structs";
import {Repositories} from "./lib/repositories";


const property: BitbucketProperties = Property.createDefaultProperties();
const bitbucket = new Bitbucket()
const repositories: Repositories =  new Repositories(bitbucket);

repositories.getAllRepositories(property).then( repos => {
    repos.forEach(function(k, v) {
        // console.log(k);
        console.log(JSON.stringify(v, null, 2));
    });
}).catch( error => {
    console.log(`ERROR: ${error}`);
});
