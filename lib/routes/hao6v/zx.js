const got = require('@/utils/got');
const cheerio = require('cheerio');

module.exports = async (ctx) => {
    const rootUrl = 'https://www.hao6v.tv/';
    const currentUrl = `${rootUrl}/gvod/zx.html`;
    const response = await got({
        method: 'get',
        url: currentUrl,
    });

    const $ = cheerio.load(response.data);

    const list = $('ul.list li');

    ctx.state.data = {
        title: '6v电影网',
        link: url,
        description: '6v电影网最新电影',
        item:
            list &&
            list
                .map((index, item) => {
                    item = $(item);
                    const pubDate = Date.parse(item.find('span').text().replace(/[\[\]]/g,''));
                    return {
                        title: item.find('a').text(),
                        link: item.find('a').attr('href'),
                        pubDate,
                    };
                })
                .get(),
    };
};
