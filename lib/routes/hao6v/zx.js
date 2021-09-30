const got = require('@/utils/got');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');

module.exports = async (ctx) => {
    const rootUrl = 'https://www.hao6v.tv/';
    const currentUrl = `${rootUrl}/gvod/zx.html`;
    const response = await got({
        method: 'get',
        url: currentUrl,
		responseType: 'buffer'
    });

    const $ = cheerio.load(iconv.decode(response.data, 'gb2312'));

    const list = $('ul.list li');

    ctx.state.data = {
        title: '6v电影网',
        link: rootUrl,
        description: '6v电影网最新电影',
        item:
            list &&
            list
                .map((index, item) => {
                    item = $(item);
                    const pubDate = Date.parse('2021-'+item.find('span').text().replace(/[\[\]]/g,''));
                    return {
                        title: item.find('a').text(),
                        link: item.find('a').attr('href'),
                        pubDate,
                    };
                })
                .get(),
    };
};
