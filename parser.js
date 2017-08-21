// sudo apt-get install google-chrome-stable
// google-chrome-stable --remote-debugging-port=9222
// Need run chrome
// /opt/google/chrome/chrome --remote-debugging-port=9222 --disable-translate --disable-extensions --disable-background-networking --safebrowsing-disable-auto-update --disable-sync --metrics-recording-only --disable-default-apps --no-first-run --disable-setuid-sandbox --window-size=1280x1012 --disable-gpu --hide-scrollbars --headless about:blank &
const chrome = require('chrome-remote-interface');
const cheerio = require('cheerio');
const fs = require('fs');
const urlModule = require("url");

const url = process.argv[2];
let match = url.match(/\-(\d+)(?:$|\/)/);
const uid = match[1];

let logPath = './tmp/'+uid+'.txt';
let film = {};

const resolveUrl = (path)=>{
    return urlModule.resolve(url, path);
};

const getTime = (date)=>{
    let monthes = {
        'января':'January',
        'февраля':'February',
        'марта':'March',
        'апреля':'April',
        'мая':'May',
        'июня':'June',
        'июля':'July',
        'августа':'August',
        'сентября':'September',
        'октября':'October',
        'ноября':'November',
        'декабря':'December'
    };
    let match = date.trim().toLowerCase().match(/(\d+)\s+(\D+)\s+(\d+)/);
    return Date.parse(match[1]+' '+monthes[match[2]]+' '+match[3]) / 1000 || null;
};

const replaceArray = function(replaceString, find, replace) {
    for (let i = 0; i < find.length; i++) {
        replaceString = replaceString.replace(find[i], (Array.isArray(replace)?replace[i]:replace));
    }
    return replaceString;
};

const parsePeople = ($link)=>{
    let response = false;
    let text = $link.text();
    if(text !== '...'){
        let match = $link.attr('href').match(/\/(\d+)\//);
        response = {
            'id':match[1],
            'url':resolveUrl($link.attr('href')),
            'name':text
        };
    }
    return response;
};

chrome(async (client) => {
    const {Network, Page, Runtime} = client;

    try {
        await Network.enable();
        await Page.enable();
        //await Network.setCacheDisabled({cacheDisabled: true});
        await Page.navigate({url: url});
        await Page.loadEventFired();

        const result = await Runtime.evaluate({
            expression: 'document.documentElement.outerHTML'
        });
        const html = result.result.value;

        let $ = cheerio.load(html);

        film.id = uid;
        film.name = $('#headerFilm h1').text();
        film.original_name = $('#headerFilm span[itemprop="alternativeHeadline"]').text();
        film.description = $('[itemprop="description"]').first().text();
        film.image = {
            'preview':$('.popupBigImage img[itemprop="image"]').attr('src'),
            'original':resolveUrl($('.popupBigImage').attr('href'))
        };
        film.trailer = $('meta[name="twitter:player:stream"]').attr('content');

        film.rating = {
            'mark':$('#block_rating .rating_ball').text(),
            'count':$('#block_rating .ratingCount').text()
        };

        film.info = {
            'year':'',
            'countries':[],
            'slogan':'',
            'directors':[],
            'scenario':[],
            'producer':[],
            'operator':[],
            'composer':[],
            'painter':[],
            'mounting':[],
            'genre':[],
            'premiere_world':'',
            'premiere_rus':'',
            'premiere_ua':'',
            'age':'',
            'time':{
                'minutes':'',
                'hours':''
            }
        };

        $('#infoTable table.info tr').each((i, tr)=>{
            let td = $('td', tr);
            let type = td.eq(0).text().trim();
            switch(type) {
                case 'год':
                    film.info.year = td.eq(1).find('a').text();
                    break;
                case 'страна':
                    td.eq(1).find('a').each((i, elem)=>{
                        film.info.countries.push($(elem).text());
                    });
                    break;
                case 'слоган':
                    film.info.slogan = replaceArray(td.eq(1).text(), ['«', '»', '&nbsp;', '&laquo;', '&raquo;'], '');
                    break;
                case 'режиссер':
                    td.eq(1).find('a').each((i, elem)=>{
                        let user = parsePeople($(elem));
                        if(user){
                            film.info.directors.push(user);
                        }
                    });
                    break;
                case 'сценарий':
                    td.eq(1).find('a').each((i, elem)=>{
                        let user = parsePeople($(elem));
                        if(user){
                            film.info.scenario.push(user);
                        }
                    });
                    break;
                case 'продюсер':
                    td.eq(1).find('a').each((i, elem)=>{
                        let user = parsePeople($(elem));
                        if(user){
                            film.info.producer.push(user);
                        }
                    });
                    break;
                case 'оператор':
                    td.eq(1).find('a').each((i, elem)=>{
                        let user = parsePeople($(elem));
                        if(user){
                            film.info.operator.push(user);
                        }
                    });
                    break;
                case 'композитор':
                    td.eq(1).find('a').each((i, elem)=>{
                        let user = parsePeople($(elem));
                        if(user){
                            film.info.composer.push(user);
                        }
                    });
                    break;
                case 'художник':
                    td.eq(1).find('a').each((i, elem)=>{
                        let user = parsePeople($(elem));
                        if(user){
                            film.info.painter.push(user);
                        }
                    });
                    break;
                case 'монтаж':
                    td.eq(1).find('a').each((i, elem)=>{
                        let user = parsePeople($(elem));
                        if(user){
                            film.info.mounting.push(user);
                        }
                    });
                    break;
                case 'жанр':
                    td.eq(1).find('a').each((i, elem)=>{
                        let text = $(elem).text();
                        if(text !== '...'){
                            film.info.genre.push(text);
                        }
                    });
                    break;
                case 'премьера (мир)':
                    film.info.premiere_world = getTime(td.eq(1).find('a').eq(0).text());
                    break;
                case 'премьера (РФ)':
                    film.info.premiere_rus = getTime(td.eq(1).find('a').eq(0).text());
                    break;
                case 'премьера (Укр.)':
                    film.info.premiere_ua = getTime(td.eq(1).find('a').eq(0).text());
                    break;
                case 'возраст':
                    match = td.eq(1).find('.ageLimit').attr('class').match(/age(\d+)/);
                    film.info.age = match[1] || null;
                    break;
                case 'время':
                    match = td.eq(1).text().match(/(\d+)\D+(\d+:\d+)/);
                    film.info.time = {
                        'minutes':match[1],
                        'hours':match[2]
                    };
                    break

            }

        });

        film.actors = [];
        $('#actorList ul').eq(0).find('li[itemprop="actors"] a').each((i, elem)=>{
            let user = parsePeople($(elem));
            if(user){
                film.actors.push(user);
            }
        });



        //film.posters = [];

        console.log(JSON.stringify(film));
    } catch (err) {
        console.error(err);
    } finally {
        client.close();
    }
}).on('error', (err) => {
    if (err.errno === undefined) err.errno = "Timeout expired";
    const exec = require('child_process').exec;
    function execute(command, callback){
        exec(command, (error, stdout, stderr)=>{ callback(stdout);});
    }
    execute("ps ax | grep remote-debug", function(data) {
        if(data.match(/remote-debug/g).length < 3) {
            // relaunch chrome
            const spawn = require('child_process').spawn;
            spawn('/opt/google/chrome/chrome', [
                '--remote-debugging-port=9222',
                '--disable-translate',
                '--disable-extensions',
                '--disable-background-networking',
                '--safebrowsing-disable-auto-update',
                '--disable-sync',
                '--metrics-recording-only',
                '--disable-default-apps',
                '--no-first-run',
                '--disable-setuid-sandbox',
                '--window-size=1280x1012',
                '--disable-gpu',
                '--hide-scrollbars',
                '--headless',
                'about:blank',
            ], {
                stdio: 'ignore', // piping all stdio to /dev/null
                detached: true
            }).unref();
        }
    });
    execute('node '+process.argv[1]+' '+process.argv[2]+' '+process.argv[3], (data)=>{
        console.log(data);
    });
    // cannot connect to the remote endpoint
    console.error(err);
});