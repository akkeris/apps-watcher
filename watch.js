const request = require('request');
const { LineStream } = require('byline');

class Watch {
  constructor(config) {
    this.config = config;
  }

  // Get current state of cluster and then watch for new events
  watchNew(path, queryParams, callback, done) {
    const uri = `${this.config.getCurrentCluster().server}${path}`;
    const requestOptions = { uri, json: true, headers: {} };
    this.config.applyToRequest(requestOptions);

    request.get(uri, requestOptions, (error, response, body) => {
      if (error) {
        console.error(error);
      }
      const rv = (body && body.metadata && body.metadata.resourceVersion) ? body.metadata.resourceVersion : undefined;
      this.watch(path, queryParams, callback, done, rv);
    });
  }

  // Watch path for events
  // If rv (resourceVersion) is passed in, start watching from rv and don't fetch old events
  watch(path, queryParams, callback, done, rv) {
    const url = `${this.config.getCurrentCluster().server}${path}`;

    const qp = {
      ...queryParams,
      resourceVersion: rv || undefined,
      watch: true,
    };

    const requestOptions = {
      method: 'GET',
      qs: qp,
      headers: {},
      uri: url,
      useQuerystring: true,
      json: true,
      keepAlive: true,
      forever: true,
      timeoutSeconds: 60 * 60,
    };

    this.config.applyToRequest(requestOptions);

    const stream = new LineStream();
    stream.on('data', (data) => {
      let obj = null;
      if (data instanceof Buffer) {
        obj = JSON.parse(data.toString());
      } else {
        obj = JSON.parse(data);
      }
      if (obj.type && obj.object) {
        callback(obj.type, obj.object);
      } else {
        console.log(`unexpected object: ${obj}`);
      }
    });

    const req = request(requestOptions, (error) => {
      if (error) {
        done(error);
      }
      done(null);
    });

    req.pipe(stream);
    return req;
  }
}

module.exports = { Watch };
