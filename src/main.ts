import {Bitbucket, Property} from "./bitbucket";
import {BitbucketProperties} from "./data-structs";


const property: BitbucketProperties = Property.createDefaultProperties();
const bitbucketObj = new Bitbucket();

bitbucketObj.getAllRepositories(Property.createDefaultProperties()).then( repos => {
    repos.forEach(function(v, k) {
        console.log(`k: ${JSON.stringify(k)})`);
        console.log(v);
    });
}).catch( error => {
    console.log(`ERROR: ${error}`);
});
