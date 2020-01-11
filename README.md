# filelist.js
## A simple FileList wrapper made using Node.js

### Note: this library doesn't have rate limiting implemented! You can only request content from FileList.ro's API 150 times an hour or roughly 2.5 times a minute, so use with caution!

Usage example: 
```js
const FileList = require('filelist.js');

const FL = new FileList('username', 'passkey');

// Search torrents
FL.search({
    // These two parameters are mandatory
    type: 'name',
    query: 'Brazzers',
    // The following parameters are optional
    // This can either be a number or an array of numbers
    category: 7,
    // These can either be a 0 (for false) or 1 (for true)
    moderated: 1,
    internal: 0,
    freeleech: 1
}).then(console.log).catch(console.error)


// Latest uploaded torrents
FL.latest({
    // All these parameters are optional
    // Maximum number of torrents displayed in the request. Can be 1-100. Default value: 100
    limit: 21,
    // Accepted as: tt00000000 or 00000000
    // imdb: tt00000000,
    // Valid values: IDs from categories, An array of them is accepted. 
    category: [21, 23]
}).then(console.log).catch(console.error)


// Both return an array of objects which have the following structure: 
const returned = {
    id: 42487,
    name: 'Big.Tits.at.School.Brazzers.Expose-ERiKHERLOV',
    imdb: null,
    freeleech: false,
    upload_date: '2009-01-13 18:49:55',
    download_link: 'https://filelist.ro/download.php?id=42487&passkey=your_passkey',
    // This will only be available if freeleech is false, otherwise it's null
    download_with_fltoken: 'https://filelist.ro/download.php?id=42487&passkey=your_passkey&usetoken=1',
    size: 551269586,
    internal: false,
    moderated: true,
    category: 'XXX',
    seeders: 2,
    leechers: 1,
    times_completed: 31605,
    comments: 86,
    files: 4,
    small_description: ''
}
```
Your passkey can be obtained from [here](https://filelist.ro/my.php)

Category IDs:
| ID | Name             |
|----|------------------|
|  1 | Filme SD         |
|  2 | Filme DVD        |
|  3 | Filme DVD-RO     |
|  4 | Filme HD         |
|  5 | FLAC             |
|  6 | Filme 4K         |
|  7 | XXX              |
|  8 | Programe         |
|  9 | Jocuri PC        |
| 10 | Jocuri Console   |
| 11 | Audio            |
| 12 | Videoclip        |
| 13 | Sport            |
| 14 | TV               |
| 15 | Desene           |
| 16 | Docs             |
| 17 | Linux            |
| 18 | Diverse          |
| 19 | Filme HD-RO      |
| 20 | Filme Blu-Ray    |
| 21 | Seriale HD       |
| 22 | Mobile           |
| 23 | Seriale SD       |
| 24 | Anime            |
| 25 | Filme 3D         |
| 26 | Filme 4K Blu-Ray |
| 27 | Seriale 4K       |