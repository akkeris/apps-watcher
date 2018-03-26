const request = require('request')
const LineStream = require('byline').LineStream

class Watch {
    constructor(config) {
        this.config = config;
    }

    watch(path, queryParams, callback, done) {
        let url = this.config.getCurrentCluster().server + path;

        queryParams['watch'] = true;
        let headerParams;

        let requestOptions = {
            method: 'GET',
            qs: queryParams,
            headers: headerParams,
            uri: url,
            useQuerystring: true,
            json: true,
            keepAlive: true,
            forever:true,
            timeoutSeconds:60 * 60
        };
        this.config.applyToRequest(requestOptions);
        let stream = new LineStream();
        stream.on('data', (data) => {
            let obj = null;
            if (data instanceof Buffer) {
                obj = JSON.parse(data.toString());
            } else {
                obj = JSON.parse(data);
            }
            if (obj['type'] && obj['object']) {
                callback(obj['type'], obj['object']);
            } else {
                console.log('unexpected object: ' + obj);
            }
        });

        let req = request(requestOptions, (error, response, body) => {
            if (error) {
                done(error);
            }
            done(null);
        });
        req.pipe(stream);
        return req;
    }
}

module.exports = {Watch}