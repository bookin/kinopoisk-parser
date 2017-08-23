[![Total Downloads](https://poser.pugx.org/bookin/kinopoisk-parser/downloads)](https://packagist.org/packages/bookin/kinopoisk-parser)
[![Latest Stable Version](https://poser.pugx.org/bookin/kinopoisk-parser/v/stable)](https://packagist.org/packages/bookin/kinopoisk-parser)
[![License](https://poser.pugx.org/bookin/kinopoisk-parser/license)](https://packagist.org/packages/bookin/kinopoisk-parser)

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
    'description' : '',
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
                'id':'',
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
        'genre':[{},...],
        'premiere_world':'',
        'premiere_rus':'',
        'premiere_ua':'',
        'age':'',
        'time':{
            'minutes':'',
            'hours':''
        }
    },
    'actors' : [{},...]
}
```

