const compiler = require('./compiler');

test(`Render art-template as RC's way`, async() => {
    const stats = await compiler('example.html');
    const output = stats.toJson().modules[0].source;

    const expectRes = 
`;
(function(rc) {
    var funcs = {
        getMain: function anonymous(data, filename) {
            'use strict';
            var _utils = window.tplUtils,
                helpers = window.tplHelp,
                _this = this,
                _out = [];
            _out.push('\\n    <div>hello world</div>\\n');
            return _out.join('');
        }
    };
    rc.template.addTempFuncs('tpl.example', funcs);
})(window.Tatami);`;

    expect(output).toBe(expectRes);
});