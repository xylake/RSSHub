const got = require('@/utils/got');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');
//
module.exports = async (ctx) => {
    const rootUrl = 'https://www.researchgate.net';
	const authorName = 'Ayman-F-Abouraddy-8186061';
    const currentUrl = `${rootUrl}/scientific-contributions/${authorName}`;
    const response = await got({
        method: 'get',
        url: currentUrl
    });

    const $ = cheerio.load(response.data);

    const list = $('.gtm-research-item');
    ctx.state.data = {
        title: 'researchgate '+authorName,
        link: rootUrl,
        description: 'contributions @researchgate',
        item:
            list &&
            list
                .map((index, item) => {
                    item = $(item);
                    const pubDate = Date.parse('1 '+item.find('.nova-legacy-e-list__item.nova-legacy-v-publication-item__meta-data-item:first-child').find('span').text());
                    return {
                        title: item.find('.nova-legacy-e-link.nova-legacy-e-link--color-inherit.nova-legacy-e-link--theme-bare').text(),
                        link: item.find('.nova-legacy-e-link.nova-legacy-e-link--color-inherit.nova-legacy-e-link--theme-bare').attr('href'),
                        pubDate,
                    };
                })
                .get(),
    };
};
