declare module 'filelist.js' {
    export class FileList {
        /**
         * @param username Your filelist.io username
         * @param passkey Your filelist.io passkey
         */
        public constructor(username: string, passkey: string);
        /** 
         * Search for a torrent on filelist.io
         * @example search({ type: 'name', query: 'The Haunting of the Hill House', category: 21, freeleech: 1 })
         */
        public search(params: SearchParams): Promise<Torrent[]>;
        /**
         * Look up the latest torrents uploaded to filelist.io
         * @example latest({ limit: 1, category: 27 })
         */
        public latest(params: LatestParams): Promise<Torrent[]>;
    }

    export interface SearchParams {
        /** The type of the search */
        type?: 'name' | 'imdb';
        /** The query for the search. If you choose imdb as type, it is accepted in two forms: tt00000000 or 00000000 */
        query: string;
        category?: number | number[];
        /** Valid values: 0, 1 */
        moderated?: number;
        /** Valid values: 0, 1 */
        internal?: number;
        /** Valid values: 0, 1 */
        freeleech?: number;
        /** Valid values: 0, 1 */
        doubleup?: number;
        output?: 'json' | 'rss';
        season?: number;
        episode?: number;
    }

    export interface LatestParams {
        /** Maximum number of torrents displayed in the request. Can be 1-100. */
        limit?: number;
        imdb?: string;
        category?: number | number[];
        output?: 'json' | 'rss';
    }

    export interface Torrent {
        /** The ID of the torrent */
        id: number;
        /** The name of the torrent */
        name: string;
        /** The imdb ID of the torrent */
        imdb: string;
        /** Whether or not the torrent is freeleech */
        freeleech: boolean;
        /** Whether or not this torrent counts as a double upload */
        doubleup: boolean;
        /** The upload date of the torrent */
        upload_date: Date;
        /** The download URL of this torrent */
        download_link: string;
        /** The size of the torrent in bytes */
        size: number;
        /** Whether or not this torrent was uploaded by the FileList internal team */
        internal: boolean;
        /** Whether or not this torrent is moderated */
        moderated: boolean;
        /** The category this torrent is in */
        category: string;
        /** The number of people seeding this torrent */
        seeders: number;
        /** The number of people leeching (downloading) this torrent */
        leechers: number;
        /** The number of times this torrent was snatched (downloaded) */
        times_completed: number;
        /** The number of comments on the torrent */
        comments: number;
        /** The number of files this torrent has */
        files: number;
        /** A small description of the torrent */
        description: string;
        tv: {
            season?: number;
            episode?: number;
        }
    }
}