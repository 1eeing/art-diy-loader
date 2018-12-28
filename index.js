const path = require('path');
const template = require('./lib/art');
const cheerio = require('cheerio');
const beautify = require('js-beautify').js;

module.exports = function(source) {
    const basename = `tpl.${path.basename(this.resourcePath, '.html')}`;
    let tpls = [];
    let render_opts = {};

    const $ = cheerio.load(source);
    if($('script').length < 1){
        render_opts.filename = 'getMain';
        tpls.push(`getMain:${template.render(source, render_opts)}`);
    }else{
        $('script').each(function() {
            const $this = $(this);
            const filename = $this.attr('id') || 'getMain';
            const html = $this.html();

            render_opts.filename = filename;
            const content = template.render(html, render_opts);
            tpls.push(`${filename}:${content}`);
        });
    }

    return beautify(
    `
    ;(function(rc) {
        var funcs = {
            ${tpls.join(',').replace(/\/\*\*\//g,'')}
        };
        rc.template.addTempFuncs('${basename}', funcs);
    })(window.Tatami);
    `);
};