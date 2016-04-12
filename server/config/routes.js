var mongojs = require('mongojs');

module.exports = function (app, config, h5) {

    var db = mongojs(config.db, ['playerData']);

    app.get('/init', function(req, res){
        var getWarzoneRecord = h5.stats.serviceRecordWarzone("Vannila Knight");
        var getArenaRecord = h5.stats.serviceRecordArena("Vannila Knight");
        var profileEmblem = h5.profile.emblemImage("Vannila Knight");
        var profileSpartan = h5.profile.spartanImage("Vannila Knight");
        var recentArenaMatches = h5.stats.playerMatches({
            player: "Vannila Knight",
            mode: "arena",
            start: 0,
            count: 20
        });
        var recentWarzoneMatches = h5.stats.playerMatches({
            player: "Vannila Knight",
            mode: "warzone",
            start: 0,
            count: 20
        });

        Promise.all([getWarzoneRecord, getArenaRecord, profileEmblem, profileSpartan, recentArenaMatches, recentWarzoneMatches]).then(function(values){
            var playerData = {
                warzoneRecord: values[0],
                arenaRecord: values[1],
                profileEmblem: values[2],
                profileSpartan: values[3],
                recentArenaMatches: values[4],
                recentWarzoneMatches: values[5]
            };

            res.send(playerData)
        });
    });

    app.all('/api/*', function (req, res) {
        res.send(404);
    });

    app.get('/', function(req, res){
        res.send('Hello yes I am API');
    });

    app.get('*', function (req, res) {
        res.render('index', {
            bootstrappedUser: req.user
        });
    });
};