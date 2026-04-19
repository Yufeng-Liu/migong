var fs = require('fs');
var f = 'c:\\Users\\饭饭童\\Desktop\\AIcoding\\Trae\\11迷宫游戏\\index.html';
var html = fs.readFileSync(f, 'utf8');
var s = html.indexOf('var LEVELS = [');
var e = html.indexOf('];', s) + 2;

var levelsStr = html.substring(s, e);

levelsStr = levelsStr.replace(/story:'([^']*)'/g, function(m, content) {
    var fixed = content.replace(/\n/g, '\\n').replace(/\r/g, '');
    return "story:'" + fixed + "'";
});

html = html.substring(0, s) + levelsStr + html.substring(e);
fs.writeFileSync(f, html);
console.log('Fixed! Size:', fs.statSync(f).size);