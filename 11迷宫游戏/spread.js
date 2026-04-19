var fs = require('fs');
var f = 'c:\\Users\\饭饭童\\Desktop\\AIcoding\\Trae\\11迷宫游戏\\index.html';
var html = fs.readFileSync(f, 'utf8');
var s = html.indexOf('var LEVELS = [');
var e = html.indexOf('];', s) + 2;
var levelsStr = html.substring(s, e);
var fn = new Function(levelsStr + '; return LEVELS;');
var LEVELS = fn();

function bfs(map, sx, sy) {
    var h = map.length, w = map[0].length;
    var vis = [];
    for (var i = 0; i < h; i++) { vis.push([]); for (var j = 0; j < w; j++) vis[i][j] = false; }
    var q = [[sx, sy]]; vis[sy][sx] = true;
    var dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    while (q.length > 0) {
        var cur = q.shift();
        for (var d = 0; d < 4; d++) {
            var nx = cur[0] + dirs[d][0], ny = cur[1] + dirs[d][1];
            if (nx >= 0 && nx < w && ny >= 0 && ny < h && !vis[ny][nx] && map[ny][nx] !== '#') {
                vis[ny][nx] = true; q.push([nx, ny]);
            }
        }
    }
    return vis;
}

LEVELS.forEach(function(lv) {
    var map = lv.map.map(function(r) { return r.split(''); });
    var vis = bfs(map, lv.start.x, lv.start.y);
    
    var spots = [];
    for (var ty = 3; ty < map.length - 2; ty++)
        for (var tx = 5; tx < map[0].length - 5; tx++)
            if (map[ty][tx] !== '#' && vis[ty][tx])
                spots.push({x: tx, y: ty});
    
    var used = {};
    lv.enemies.forEach(function(en, idx) {
        if (idx < spots.length) {
            en.x = spots[idx].x;
            en.y = spots[idx].y;
        }
    });
});

levelsStr = 'var LEVELS = ' + JSON.stringify(LEVELS, null, 4) + ';';
html = html.substring(0, s) + levelsStr + html.substring(e);
fs.writeFileSync(f, html);
console.log('DONE! Enemies spread out.');