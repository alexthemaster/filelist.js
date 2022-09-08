import { fetch, FetchResultTypes } from "@sapphire/fetch";
import { URLSearchParams } from "node:url";

export class FileList {
  private auth: string;

  public constructor(username: string, passkey: string) {
    this.auth = Buffer.from(`${username}:${passkey}`).toString("base64");
  }

  /**
   * Search for a torrent on filelist.io
   * @example search({ type: 'name', query: 'The Haunting of the Hill House', category: 21, freeleech: 1 })
   */
  public search(
    params: SearchParams | SearchParamsIMDB
  ): Promise<Torrent[] | null> {
    type SearchParamsAction =
      | ({ action: "search-torrents"; output: "json" } & SearchParams)
      | ({ action: "search-torrents"; output: "json" } & SearchParamsIMDB);

    const searchParams: SearchParamsAction = {
      action: "search-torrents",
      output: "json",
      ...params,
    };

    return this.query(searchParams);
  }

  /**
   * Look up the latest torrents uploaded to filelist.io
   * @example latest({ limit: 1, category: 27 })
   */
  public latest(params: LatestParams): Promise<Torrent[] | null> {
    type SearchParamsAction = {
      action: "latest-torrents";
      output: "json";
    } & LatestParams;

    const searchParams: SearchParamsAction = {
      action: "latest-torrents",
      output: "json",
      ...params,
    };

    return this.query(searchParams);
  }

  private async query(
    params: SearchParams | SearchParams | LatestParams
  ): Promise<Torrent[] | null> {
    const res = await fetch(
      `${apiUrl}?${new URLSearchParams(params as URLSearchParams).toString()}`,
      {
        headers: {
          Authorization: `Basic ${this.auth}`,
        },
      },
      FetchResultTypes.JSON
    ).catch((err: { code: 400 | 401 | 403 | 429 | 503 }) => {
      if (err.code == 429) {
        console.info("Rate limit hit... retrying in 10 minutes.");
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(this.query(params));
          }, 10000 * 60);
        });
      } else throw new Error(ErrorCodes[err.code]);
    });

    if (!res) return null;

    return res as Torrent[];
  }
}
export type IMDB = `tt${number}` | number;
export type Category =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24
  | 25
  | 26
  | 27;

export interface SearchParams {
  /** The type of the search */
  type?: "name";
  /** The query for the search. If you choose imdb as type, it is accepted in two forms: tt00000000 or 00000000 */
  query: string;
  /** Category IDs, multiple values are accepted if in an array. */
  category?: Category | Category[];
  moderated?: 0 | 1;
  internal?: 0 | 1;
  freeleech?: 0 | 1;
  doubleup?: 0 | 1;
  season?: number;
  episode?: number;
}

export interface SearchParamsIMDB {
  type?: "imdb";
  /** The query for the search. If you choose imdb as type, it is accepted in two forms: tt00000000 or 00000000 */
  query: IMDB;
  /** Category IDs, multiple values are accepted if in an array. */
  category?: Category | Category[];
  moderated?: 0 | 1;
  internal?: 0 | 1;
  freeleech?: 0 | 1;
  doubleup?: 0 | 1;
  season?: number;
  episode?: number;
}

export interface LatestParams {
  /** Maximum number of torrents displayed in the request. Can be 1-100. */
  limit?: number;
  /** Accepted as: tt00000000 or 00000000 */
  imdb?: IMDB;
  /** Category IDs, multiple values are accepted if in an array. */
  category?: Category | Category[];
}

export interface Torrent {
  /** The ID of the torrent */
  id: number;
  /** The name of the torrent */
  name: string;
  /** The imdb ID of the torrent */
  imdb: IMDB;
  /** Whether or not the torrent is freeleech */
  freeleech: 0 | 1;
  /** Whether or not this torrent counts as a double upload */
  doubleup: 0 | 1;
  /** The upload date of the torrent */
  upload_date: string;
  /** The download URL of this torrent */
  download_link: string;
  /** The size of the torrent in bytes */
  size: number;
  /** Whether or not this torrent was uploaded by the FileList internal team */
  internal: 0 | 1;
  /** Whether or not this torrent is moderated */
  moderated: 0 | 1;
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
  tv?: {
    season?: number;
    episode?: number;
  };
}

export const apiUrl = "https://filelist.io/api.php";

export const ErrorCodes = {
  400: "Invalid search/filter",
  401: "Username and passkey cannot be empty.",
  403: "Invalid username or passkey / Too many failed authentications",
  429: "Rate limit reached",
  503: "Service unavailable",
};
