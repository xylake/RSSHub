// example usage: `/nature/research/ng`
// The journals from NPG are run by different group of people,
// and the website of may not be consitent for all the journals
//
// This router has **just** been tested in:
// nature:           Nature
// nbt:              Nature Biotechnology
// neuro:            Nature Neuroscience
// ng:               Nature Genetics
// ni:               Nature Immunology
// nmeth:            Nature Method
// nchem:            Nature Chemistry
// nmat:             Nature Materials
// natmachintell:    Nature Machine Intelligence
// ncomms:			 Nature Coommunications
// nnano: 			 Nature Nanotechnoledge
// natelectron:		 Nature Electronics
// lsa 				 Light 
// commsphys		 Communication Physics
// 


const cheerio = require('cheerio');
const got = require('@/utils/got');

module.exports = async (ctx) => {
    const baseURL = `https://www.nature.com`;

    const subject = ctx.params.subject || 'optics-and-photonics';
	var journal = ctx.params.journal || 'ncomms';
	
	journal = journal.replace(/-/g,'%2C+');
	
    const pageURL = `${baseURL}/search?order=date_desc&subject=${subject}&journal=${journal}`;
	
	
	const cookie = {
		idp_marker:	'c3bd46cf-7632-4292-b625-63291eb3e8da',
		idp_session: 'sVERSION_14ceefb04-de79-426d-8919-0cc79fd77801',
		idp_session_http: 'hVERSION_1d0a62b4e-82c4-49d7-a1d1-05f52041ff4d'
	};
	
	const header = {
        Cookie: cookie,
        Referer: pageURL,
    };
	
    const pageResponse = await got({
        method: 'get',
        url: pageURL,
        headers: header,
    });
	

	const $ = cheerio.load(pageResponse.data);
	
	//console.log($.html());
	const list = $('article.u-full-height.c-card.c-card--flush');

	//console.log($(list[1]).html());
	
    ctx.state.data = {
        title: 'nature subject: '+subject,
        link: pageURL,
        description: subject+' @nature',
        item:
            list &&
            list
                .map((index, item) => {
                    item = $(item);

					const pubDate = Date.parse(item.find('[itemprop=datePublished]').attr('datetime'));
                    return {
                        title: item.find('[itemprop=url]').text(),
                        link: item.find('[itemprop=url]').attr('href'),
						author: item.find('[itemprop=name]').map(function() { return $(this).text(); }).get().join(', '), 
						description: item.find('[data-test=journal-title-and-link]').text(), // 文章摘要或全文
                        pubDate,
                    };
                })
                .get(),
    }; 
};
