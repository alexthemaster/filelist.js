## A simple FileList wrapper made using Node.js

### ⚠️ Important to know: FileList.io's API has a rate limit of 150 requests an hour, so use with caution! When the rate limit is hit the library will attempt to re-query your request every 10 minutes.

Installation: `npm install filelist.js` or `yarn add filelist.js`

Documentation: [here](https://alexthemaster.github.io/filelist.js)

<br>

Usage example:

- JavaScript:

```js
const { FileList } = require("filelist.js");

const FL = new FileList("username", "passkey");

// Search torrents
FL.search({
  // These two parameters are mandatory
  type: "name",
  query: "The Haunting of the Hill House",
  // The following parameters are optional
  // This can either be a number or an array of numbers
  category: 21,
  // These can either be a 0 (for false) or 1 (for true)
  moderated: 1,
  internal: 0,
  freeleech: 1,
  doubleup: 0,
  // This defaults to json - can be either json or rss
  output: "json",
  // These can be integers
  season: null,
  episode: null,
})
  .then(console.log)
  .catch(console.error);

// Latest uploaded torrents
FL.latest({
  // All these parameters are optional
  // Maximum number of torrents displayed in the request. Can be 1-100. Default value: 100
  limit: 50,
  // Accepted as: tt00000000 or 00000000
  // imdb: tt00000000,
  // Valid values: IDs from categories, An array of them is accepted.
  category: [21, 23],
})
  .then(console.log)
  .catch(console.error);

// Both return an array of objects which have the following structure:
const returned = [
  {
    id: 588856,
    name: "The.Haunting.of.Hill.House.S01.DIRFIX.PROPER.1080p.WEBRip.X264-DEFLATE",
    imdb: "tt6763664",
    freeleech: 1,
    doubleup: 0,
    upload_date: "2018-10-13 14:36:43",
    download_link:
      "https://filelist.io/download.php?id=588856&passkey=(yourPasskey)",
    size: 28122405708,
    internal: 0,
    moderated: 1,
    category: "Seriale HD",
    seeders: 2,
    leechers: 0,
    times_completed: 2629,
    comments: 6,
    files: 10,
    small_description: "Horror",
    tv: { season: 1, episode: null },
  },
];
```

- TypeScript:

```ts
import { FileList } from "filelist.js";

const FL = new FileList("username", "passkey");

FL.search({
  type: "name",
  query: "The Haunting of the Hill House",
  category: 50,
  moderated: 1,
  internal: 0,
  freeleech: 1,
  doubleup: 0,
  output: "json",
  season: null,
  episode: null,
})
  .then(console.log)
  .catch(console.error);

FL.latest({
  limit: 21,
  category: [21, 23],
})
  .then(console.log)
  .catch(console.error);

const returned = [
  {
    id: 588856,
    name: "The.Haunting.of.Hill.House.S01.DIRFIX.PROPER.1080p.WEBRip.X264-DEFLATE",
    imdb: "tt6763664",
    freeleech: 1,
    doubleup: 0,
    upload_date: "2018-10-13 14:36:43",
    download_link:
      "https://filelist.io/download.php?id=588856&passkey=(yourPasskey)",
    size: 28122405708,
    internal: 0,
    moderated: 1,
    category: "Seriale HD",
    seeders: 2,
    leechers: 0,
    times_completed: 2629,
    comments: 6,
    files: 10,
    small_description: "Horror",
    tv: { season: 1, episode: null },
  },
];
```

Your passkey can be obtained from [here](https://filelist.io/my.php)

Category IDs:

| ID  | Name             |
| --- | ---------------- |
| 1   | Filme SD         |
| 2   | Filme DVD        |
| 3   | Filme DVD-RO     |
| 4   | Filme HD         |
| 5   | FLAC             |
| 6   | Filme 4K         |
| 7   | XXX              |
| 8   | Programe         |
| 9   | Jocuri PC        |
| 10  | Jocuri Console   |
| 11  | Audio            |
| 12  | Videoclip        |
| 13  | Sport            |
| 14  | TV               |
| 15  | Desene           |
| 16  | Docs             |
| 17  | Linux            |
| 18  | Diverse          |
| 19  | Filme HD-RO      |
| 20  | Filme Blu-Ray    |
| 21  | Seriale HD       |
| 22  | Mobile           |
| 23  | Seriale SD       |
| 24  | Anime            |
| 25  | Filme 3D         |
| 26  | Filme 4K Blu-Ray |
| 27  | Seriale 4K       |
