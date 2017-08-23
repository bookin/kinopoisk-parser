Kinopoisk Parser Film
============================

[![Total Downloads](https://poser.pugx.org/bookin/kinopoisk-parser/downloads)](https://packagist.org/packages/bookin/kinopoisk-parser)
[![Latest Stable Version](https://poser.pugx.org/bookin/kinopoisk-parser/v/stable)](https://packagist.org/packages/bookin/kinopoisk-parser)
[![License](https://poser.pugx.org/bookin/kinopoisk-parser/license)](https://packagist.org/packages/bookin/kinopoisk-parser)

## Configuring a server

Install nodejs from [nvm](https://github.com/creationix/nvm):

```
sudo apt-get update
sudo apt-get install build-essential libssl-dev
curl -sL https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh -o install_nvm.sh
bash install_nvm.sh
source ~/.profile
nvm install node
nvm use node
```

Install [Google Chrome](http://help.ubuntu.ru/wiki/google_chrome):

```
sudo apt-get install google-chrome-stable
```

If you will use library in the PHP with composer, need install [composer](https://getcomposer.org/doc/00-intro.md#installation-linux-unix-osx):

```
curl -sS https://getcomposer.org/installer | sudo php -- --install-dir=/usr/local/bin --filename=composer
```

## Installation


#### NodeJs

_`TODO...`_

#### PHP

To install, either run

```
$ php composer.phar require bookin/kinopoisk-parser "@dev"
```

or add

```
"bookin/kinopoisk-parser": "@dev"
```

to the ```require``` section of your `composer.json` file.


## Usage

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

