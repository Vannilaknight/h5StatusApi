var path = require('path');
var rootPath = path.normalize(__dirname + '/../../');

module.exports = {
    development: {
        db: 'mongodb://admin:password@ds029615.mlab.com:29615/halo5api',
        rabbit: 'amqp://docker.dev:5672/',
        rootPath: rootPath,
        port: process.env.PORT || 3000
    },
    production: {
        rootPath: rootPath,
        db: 'mongodb://admin:password@ds029615.mlab.com:29615/halo5api',
        rabbit: 'amqp://jncmibao:mRrr17_UqpKdLMYXEj5-nNvROywJOZ3t@hyena.rmq.cloudamqp.com/jncmibao',
        port: process.env.PORT || 80
    }
}