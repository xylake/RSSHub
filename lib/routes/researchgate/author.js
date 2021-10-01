const got = require('@/utils/got');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');
//
module.exports = async (ctx) => {
	const { type = 'author', param = 'Ayman-F-Abouraddy-8186061' } = ctx.params;
	
    const rootUrl = 'https://www.researchgate.net';
  	
	const typeMap = {
		author: {
			name: 'author ',
			url: (rootUrl, param) => rootUrl+'/scientific-contributions/'+param,
			list_id: '.gtm-research-item', 
		},
		profile: {
			name:'profile ',
			url:(rootUrl, param) => rootUrl+'/profile/'+param+'/research',
			list_id: '.nova-legacy-o-stack__item',	   
		},
	};	
	
 	const currentUrl = typeMap[type].url(rootUrl, param);
	
    const response = await got({
        method: 'get',
        url: currentUrl
    });

    const $ = cheerio.load(response.data);

	const list = $(typeMap[type].list_id);
	
	//console.log($(list[1]).html());
	
    ctx.state.data = {
        title: 'researchgate '+typeMap[type].name+param,
        link: currentUrl,
        description: typeMap[type].name+param+' @researchgate',
        item:
            list &&
            list
                .map((index, item) => {
                    item = $(item);

					const pubDate = Date.parse(item.find('[itemprop=datePublished]').attr('content'));
                    return {
                        title: item.find('[itemprop=headline]').text(),
                        link: item.find('[itemprop=headline]').find('a').attr('href'),
						author: item.find('[itemprop=author]').map(function() { return $(this).text(); }).get().join(', '), 
						description: '', // 文章摘要或全文
                        pubDate,
                    };
                })
                .get(),
    }; 

};
