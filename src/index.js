const { api, passkey_url } = require('./static.json');
const fetch = require('node-fetch');
const querystring = require('querystring')
const imdb_regex = /^([1-9]+|tt[1-9]+)/g;

/**
 * @typedef {object} Torrent
 * @property {number} id The ID of the torrent
 * @property {string} name The name of the torrent
 * @property {string} imdb The imdb ID of the torrent
 * @property {boolean} freeleech Whether or not the torrent is freeleech
 * @property {boolean} doubleup Whether or not this torrent counts as a double upload
 * @property {Date} upload_date The upload date of the torrent
 * @property {URL} download_link The download URL of this torrent
 * @property {number} size The size of the torrent in bytes
 * @property {boolean} internal Whether or not this torrent was uploaded by the FileList internal team
 * @property {boolean} moderated Whether or not this torrent is moderated
 * @property {string} category The category this torrent is in
 * @property {number} seeders The number of people seeding this torrent
 * @property {number} leechers The number of people leeching (downloading) this torrent
 * @property {number} times_completed The number of times this torrent was snatched (downloaded)
 * @property {number} comments The number of comments on the torrent
 * @property {number} files The number of files this torrent has
 * @property {string} small_description A small description of the torrent
 * @property {object} [tv] An object containing the season / episode details of this torrent - if applies
 * @property {number|null} [tv.season]
 * @property {number|null} [tv.episode] 
 */

/**
 * @class
 * @author Alex Kovacs <alex@atm.moe>
 * @license MIT
 */
class FileList {
    /**
     * @param {string} username Your filelist.io username
     * @param {string} passkey Your filelist.io passkey
     */
    constructor(username, passkey) {
        if (!username) throw new Error('Please enter your FileList username.');
        if (!passkey) throw new Error(`Please enter your FileList passkey. This can be found at ${passkey_url}`);

        const base64 = Buffer.from(`${username}:${passkey}`).toString('base64');
        Object.defineProperty(this, 'auth', { value: `Basic ${base64}` });
    }

    /**
     * Search for a torrent on filelist.io
     * @async
     * @param {object} params
     * @param {string} [params.type=name] The type of the search. This can either be imdb or name - defaults to name
     * @param {string} params.query The query for the search. If you choose imdb as type, it is accepted in two forms: tt00000000 or 00000000
     * @param {number|number[]} [params.category] Valid values: IDs from categories, An array of them is accepted. 
     * @param {number} [params.moderated] Valid values: 0, 1
     * @param {number} [params.internal] Valid values: 0, 1
     * @param {number} [params.freeleech] Valid values: 0, 1
     * @param {number} [params.doubleup] Valid values: 0, 1
     * @param {string} [params.output] Valid values: json, rss. - defaults to JSON.
     * @param {number} [params.season] Valid values: integers
     * @param {number} [params.episode] Valid values: integers
     * @returns {Promise<Torrent[]>}
     * @example search({ type: 'name', query: 'The Haunting of the Hill House', category: 21, freeleech: 1 })
     */
    async search(params = { type: 'name' }) {
        if (!['name', 'imdb'].includes(params.type.toLowerCase())) { console.info("You didn't provide a valid type, defaulting to type of name."); params.type = 'name'; }

        if (!params.query) throw new Error('Please provide a search query!');

        if (params.type === 'imdb' && !imdb_regex.test(params.query)) { console.info("It looks like you selected imdb as the search type, but didn't provide a valid imdb query search. Defaulting to name type searching."); params.type = 'name'; }

        if (params.category && isNaN(params.category) && Array.isArray(params.category)) params.category = params.category.join(',');
        if (params.category && isNaN(params.category)) { console.info("You didn't provide a valid category input. Valid values: IDs from categories, An array of them is accepted. "); params.category = '' };

        if (params.moderated && (isNaN(params.moderated) || ![0, 1].includes(params.moderated))) { console.info("You didn't provide a valid moderated value. Valid values: 0, 1"); params.moderated = '' };

        if (params.internal && (isNaN(params.internal) || ![0, 1].includes(params.internal))) { console.info("You didn't provide a valid internal value. Valid values: 0, 1"); params.internal = '' };

        if (params.freeleech && (isNaN(params.freeleech) || ![0, 1].includes(params.freeleech))) { console.info("You didn't provide a valid freeleech value. Valid values: 0, 1"); params.freeleech = '' };

        if (params.doubleup && (isNaN(params.doubleup) || ![0, 1].includes(params.doubleup))) { console.info("You didn't provide a valid doubleup value. Valid values: 0, 1"); params.doubleup = '' };

        if (params.output && !['json', 'rss'].includes(params.output.toLowerCase())) { console.info("You didn't provide a valid output, defaulting to the output of JSON."); params.output = 'json'; }

        if (params.season && (isNaN(params.season))) { console.info("You didn't provide a valid integer value for season. Valid values: integers"); params.season = '' };

        if (params.episode && (isNaN(params.episode))) { console.info("You didn't provide a valid integer value for episode. Valid values: integers"); params.episode = '' };

        params.action = 'search-torrents';

        let res = await fetch(api + '?' + querystring.stringify(params), {
            headers: { Authorization: this.auth }
        });

        res = await res.json();
        if (res.error) throw new Error(res.error);

        return res.map(torrent => ({
            id: torrent.id,
            name: torrent.name,
            imdb: torrent.imdb,
            freeleech: !!torrent.freeleech,
            upload_date: torrent.upload_date,
            download_link: torrent.download_link,
            size: torrent.size,
            internal: !!torrent.internal,
            moderated: !!torrent.moderated,
            category: torrent.category,
            seeders: torrent.seeders,
            leechers: torrent.leechers,
            times_completed: torrent.times_completed,
            comments: torrent.comments,
            files: torrent.files,
            small_description: torrent.small_description,
            tv: {
                season: torrent.tv ? torrent.tv.season : null,
                episode: torrent.tv ? torrent.tv.episode : null
            }
        }));
    }

    /**
     * Look up the latest torrents uploaded to filelist.io
     * @async
     * @param {object} params
     * @param {string} [params.limit] Maximum number of torrents displayed in the request. Can be 1-100. Default value: 100
     * @param {string} [params.imdb] Accepted as: tt00000000 or 00000000
     * @param {number|number[]} [params.category] Valid values: IDs from categories, An array of them is accepted. 
     * @param {string} [params.output] Valid values: json, rss. - defaults to JSON.
     * @returns {Promise<Torrent[]>}
     * @example latest({ limit: 1, category: 27 })
     */
    async latest(params = {}) {
        if (params.limit && (isNaN(params.limit) || params.limit < 1 || params.limit > 100)) { console.info("You didn't provide a valid limit. Can be 1-100. Defaulting to 100."); params.limit = ''; }

        if (params.imdb && !imdb_regex.test(params.imdb)) { console.info("You didn't provide a valid imdb search. Defaulting to none."); params.imdb = ''; }

        if (params.category && isNaN(params.category) && Array.isArray(params.category)) params.category = params.category.join(',');
        if (params.category && isNaN(params.category)) { console.info("You didn't provide a valid category input. Valid values: IDs from categories, An array of them is accepted. "); params.category = '' };

        if (params.output && !['json', 'rss'].includes(params.output.toLowerCase())) { console.info("You didn't provide a valid output, defaulting to the output of JSON."); params.output = 'json'; }

        params.action = 'latest-torrents';

        let res = await fetch(api + '?' + querystring.stringify(params), {
            headers: { Authorization: this.auth }
        });

        res = await res.json();
        if (res.error) throw new Error(res.error);

        return res.map(torrent => ({
            id: torrent.id,
            name: torrent.name,
            imdb: torrent.imdb,
            freeleech: !!torrent.freeleech,
            doubleup: !!torrent.doubleup,
            upload_date: torrent.upload_date,
            download_link: torrent.download_link,
            size: torrent.size,
            internal: !!torrent.internal,
            moderated: !!torrent.moderated,
            category: torrent.category,
            seeders: torrent.seeders,
            leechers: torrent.leechers,
            times_completed: torrent.times_completed,
            comments: torrent.comments,
            files: torrent.files,
            small_description: torrent.small_description,
            tv: {
                season: torrent.tv ? torrent.tv.season : null,
                episode: torrent.tv ? torrent.tv.episode : null
            }
        }));
    }
}

module.exports = FileList;