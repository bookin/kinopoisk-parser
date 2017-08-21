- Install nodejs and npm
- Install chrome: `sudo apt-get install google-chrome-stable`

Manual command:

`parser.js https://www.kinopoisk.ru/film/telokhranitel-killera-2017-835877/` 

PHP class:

`Kinopoisk::parseByUrl('https://www.kinopoisk.ru/film/telokhranitel-killera-2017-835877/')`


Returns object:

```
{
    'id' : '',
    'name' : '',
    'original_name' : '',
    'image' : {
        'preview' : '',
        'original' : '',
    },
    'trailer' : '',
    'rating' : {
        'mark' : '',
        'count' : '',
    },
    'info' : {
        'year':'',
        'countries':['','',...],
        'slogan':'',
        'directors':[
            {
                'url':'',
                'name':''
            },
            ...
        ],
        'scenario':[{},...],
        'producer':[{},...],
        'operator':[{},...],
        'composer':[{},...],
        'painter':[{},...],
        'mounting':[{},...],
        'genre':['','',...],
        'premiere_world':'',
        'premiere_rus':'',
        'premiere_ua':'',
        'time':{
            'minutes':'',
            'hours':''
        }
    },
    'actors' : [{},...]
}
```

