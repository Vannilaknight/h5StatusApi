var mongojs = require('mongojs'),
    CronJob = require('cron').CronJob,
    magicbus = require('@leisurelink/magicbus'),
    Promise = require('bluebird');


var mainUser = "Vannila Knight";


module.exports = function (config, h5) {

    var db = mongojs(config.db, ['playerData']);

    var broker = magicbus.createBroker('h5', 'api', 'amqp://docker.dev:5672/');
    var publisher = magicbus.createPublisher(broker);

    h5.metadata.gameBaseVariants().then(function(data){
        console.log(data);
    });

    var job = new CronJob({
        cronTime: '*/5 * * * * *',
        onTick: function() {
            var getWarzoneRecord = h5.stats.serviceRecordWarzone(mainUser);
            var getArenaRecord = h5.stats.serviceRecordArena(mainUser);
            var profileEmblem = h5.profile.emblemImage(mainUser);
            var profileSpartan = h5.profile.spartanImage(mainUser);
            var recentMatches = h5.stats.playerMatches(mainUser);

            Promise.all([getWarzoneRecord, getArenaRecord, profileEmblem, profileSpartan, recentMatches]).then(function(values){
                var playerData = {
                    warzoneRecord: values[0],
                    arenaRecord: values[1],
                    profileEmblem: values[2],
                    profileSpartan: values[3],
                    recentMatches: values[4]
                };

                publisher.publish('h5.player-update', {
                    playerData: playerData
                });
            });
        },
        start: false,
        timeZone: 'America/Los_Angeles'
    });

    job.start();
};

function isEquivalent(a, b) {
    // Create arrays of property names
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);

    // If number of properties is different,
    // objects are not equivalent
    if (aProps.length != bProps.length) {
        console.log('property lengths dont match')
        return false;
    }

    for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i];

        // If values of same property are not equal,
        // objects are not equivalent
        if (a[propName] !== b[propName]) {
            console.log('unequal properties: ' + propName)
            return false;
        }
    }

    // If we made it this far, objects
    // are considered equivalent
    return true;
}
