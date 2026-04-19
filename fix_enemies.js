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
    
    lv.enemies.forEach(function(en) {
        if (en.y >= 0 && en.y < map.length && en.x >= 0 && en.x < map[0].length) {
            var tile = map[en.y][en.x];
            var reachable = vis[en.y] && vis[en.y][en.x];
            if (tile === '#' || !reachable) {
                console.log('FIXING ' + lv.name + ' ' + en.type + '@(' + en.x + ',' + en.y + ') tile=' + tile);
                var found = false;
                for (var ty = 3; ty < map.length - 2 && !found; ty++) {
                    for (var tx = 5; tx < map[0].length - 5 && !found; tx++) {
                        if (map[ty][tx] !== '#' && vis[ty] && vis[ty][tx]) {
                            en.x = tx; en.y = ty;
                            found = true;
                            console.log('  -> moved to (' + tx + ',' + ty + ')');
                        }
                    }
                }
            }
        }
    });
});

levelsStr = 'var LEVELS = ' + JSON.stringify(LEVELS, null, 4) + ';';
html = html.substring(0, s) + levelsStr + html.substring(e);
fs.writeFileSync(f, html);
console.log('\nDONE! Fixed all enemy positions.');