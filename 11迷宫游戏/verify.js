var fs = require('fs');
var html = fs.readFileSync('c:\\Users\\饭饭童\\Desktop\\AIcoding\\Trae\\11迷宫游戏\\index.html', 'utf8');

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

var allOk = true;
LEVELS.forEach(function(lv, i) {
    var map = lv.map.map(function(r) { return r.split(''); });
    var sx = lv.start.x, sy = lv.start.y;
    var ex = -1, ey = -1;
    for (var y = 0; y < map.length; y++)
        for (var x = 0; x < map[y].length; x++) {
            if (map[y][x] === 'E') { ex = x; ey = y; }
        }
    var vis = bfs(map, sx, sy);
    var canReachExit = (ex >= 0 && ey >= 0) ? vis[ey][ex] : false;
    if (!canReachExit) allOk = false;
    console.log((canReachExit ? '✅' : '❌') + ' L' + (i+1) + ' ' + lv.name.padEnd(18) + ' 出口:' + (canReachExit ? '可达' : '不可达'));
    
    lv.enemies.forEach(function(en) {
        if (en.x >= 0 && en.y >= 0 && en.y < map.length && en.x < map[0].length) {
            var tile = map[en.y][en.x];
            var reachable = vis[en.y] && vis[en.y][en.x];
            var ok = tile !== '#' && reachable;
            if (!ok) allOk = false;
            console.log('   ' + en.type.padEnd(12) + '@(' + en.x + ',' + en.y + ') 格子=' + tile + (tile === '#' ? ' ❌墙内!' : '') + (!reachable ? ' ❌不可达!' : ' ✅'));
        } else {
            console.log('   ' + en.type.padEnd(12) + '@(' + en.x + ',' + en.y + ') ❌越界!');
            allOk = false;
        }
    });
});
console.log('\n' + (allOk ? '🎉 全部通过！' : '⚠️ 有问题需要修复'));