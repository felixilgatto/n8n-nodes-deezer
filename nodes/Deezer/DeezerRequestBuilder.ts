import type { IDataObject, IExecuteFunctions, IHttpRequestOptions } from 'n8n-workflow';
import { buildDeezerSearchQuery } from './GenericFunctions';

type RequestBuilder = (excf: IExecuteFunctions, index: number) => IHttpRequestOptions;

// ------------------------------------------------------------------
//         Helpers
// ------------------------------------------------------------------

const param = (excf: IExecuteFunctions, index: number, name: string, fallback?: unknown) =>
	excf.getNodeParameter(name, index, fallback) as string;

/** GET a path built from the `id` parameter, e.g. `/album/{id}/tracks` */
const getById =
	(resource: string, connection = ''): RequestBuilder =>
	(excf, index) => ({
		method: 'GET',
		url: `/${resource}/${param(excf, index, 'id')}${connection ? `/${connection}` : ''}`,
	});

/** GET a fixed path */
const getPath =
	(url: string): RequestBuilder =>
	() => ({ method: 'GET', url });

/** Search, with order + advanced filters only where Deezer supports them */
const search =
	(type: string, advanced = true): RequestBuilder =>
	(excf, index) => {
		const keyword = param(excf, index, 'keyword');

		if (!advanced) {
			return { method: 'GET', url: `/search/${type}`, qs: { q: keyword } };
		}

		const order = param(excf, index, 'order');
		const filters = excf.getNodeParameter('filters', index, {}) as IDataObject;

		return {
			method: 'GET',
			url: `/search/${type}`,
			qs: { order, q: buildDeezerSearchQuery(keyword, filters) },
		};
	};

/** Add / remove an object from the authenticated user's favorites */
const favorite =
	(method: 'POST' | 'DELETE', connection: string, idField: string): RequestBuilder =>
	(excf, index) => ({
		method,
		url: `/user/me/${connection}`,
		qs: { [idField]: param(excf, index, 'id') },
	});

const favorites = (connection: string, idField: string) => ({
	addToFavorites: favorite('POST', connection, idField),
	removeFromFavorites: favorite('DELETE', connection, idField),
});

/** `me` when the node returns the authenticated user, otherwise the given User ID */
function getUserId(excf: IExecuteFunctions, index: number): string {
	const returnMyUser = excf.getNodeParameter('returnMyUser', index, false) as boolean;

	return returnMyUser ? 'me' : param(excf, index, 'userId');
}

const getUser =
	(connection = ''): RequestBuilder =>
	(excf, index) => ({
		method: 'GET',
		url: `/user/${getUserId(excf, index)}${connection ? `/${connection}` : ''}`,
	});

const getChart =
	(type = ''): RequestBuilder =>
	(excf, index) => {
		const genreId = excf.getNodeParameter('genreId', index, 0) as number;

		return { method: 'GET', url: `/chart/${genreId}${type ? `/${type}` : ''}` };
	};

// ------------------------------------------------------------------
//         Resources
// ------------------------------------------------------------------

const crud: Record<string, Record<string, RequestBuilder>> = {
	album: {
		get: getById('album'),
		getTracks: getById('album', 'tracks'),
		getFans: getById('album', 'fans'),
		search: search('album'),
		...favorites('albums', 'album_id'),
	},
	artist: {
		get: getById('artist'),
		getTopTracks: getById('artist', 'top'),
		getAlbums: getById('artist', 'albums'),
		getFans: getById('artist', 'fans'),
		getRelatedArtists: getById('artist', 'related'),
		getRadio: getById('artist', 'radio'),
		getPlaylists: getById('artist', 'playlists'),
		search: search('artist'),
		...favorites('artists', 'artist_id'),
	},
	chart: {
		get: getChart(),
		getAlbums: getChart('albums'),
		getArtists: getChart('artists'),
		getPlaylists: getChart('playlists'),
		getPodcasts: getChart('podcasts'),
		getTracks: getChart('tracks'),
	},
	editorial: {
		getAll: getPath('/editorial'),
		get: getById('editorial'),
		getSelection: getById('editorial', 'selection'),
		getChart: getById('editorial', 'charts'),
		getReleases: getById('editorial', 'releases'),
	},
	episode: {
		get: getById('episode'),
	},
	genre: {
		getAll: getPath('/genre'),
		get: getById('genre'),
		getArtists: getById('genre', 'artists'),
		getPodcasts: getById('genre', 'podcasts'),
		getRadios: getById('genre', 'radios'),
	},
	playlist: {
		get: getById('playlist'),
		getFans: getById('playlist', 'fans'),
		getTracks: getById('playlist', 'tracks'),
		getRadio: getById('playlist', 'radio'),
		search: search('playlist'),
		create: (excf, index) => ({
			method: 'POST',
			url: '/user/me/playlists',
			qs: { title: param(excf, index, 'name') },
		}),
		update: (excf, index) => {
			const fields = excf.getNodeParameter('updateFields', index, {}) as IDataObject;

			return { method: 'POST', url: `/playlist/${param(excf, index, 'id')}`, qs: fields };
		},
		delete: (excf, index) => ({ method: 'DELETE', url: `/playlist/${param(excf, index, 'id')}` }),
		add: (excf, index) => ({
			method: 'POST',
			url: `/playlist/${param(excf, index, 'id')}/tracks`,
			qs: { songs: param(excf, index, 'trackID') },
		}),
		remove: (excf, index) => ({
			method: 'DELETE',
			url: `/playlist/${param(excf, index, 'id')}/tracks`,
			qs: { songs: param(excf, index, 'trackID') },
		}),
		reorderTracks: (excf, index) => ({
			method: 'POST',
			url: `/playlist/${param(excf, index, 'id')}/tracks`,
			qs: { order: param(excf, index, 'trackID') },
		}),
		...favorites('playlists', 'playlist_id'),
	},
	podcast: {
		get: getById('podcast'),
		getEpisodes: getById('podcast', 'episodes'),
		search: search('podcast'),
		...favorites('podcasts', 'podcast_id'),
	},
	radio: {
		getAll: getPath('/radio'),
		get: getById('radio'),
		getTracks: getById('radio', 'tracks'),
		getGenres: getPath('/radio/genres'),
		getLists: getPath('/radio/lists'),
		search: search('radio', false),
		...favorites('radios', 'radio_id'),
	},
	track: {
		get: getById('track'),
		search: search('track'),
		...favorites('tracks', 'track_id'),
	},
	user: {
		get: getUser(),
		getPlaylists: getUser('playlists'),
		getFavoriteTracks: getUser('tracks'),
		getFavoriteAlbums: getUser('albums'),
		getFavoriteArtists: getUser('artists'),
		getFavoritePodcasts: getUser('podcasts'),
		getFavoriteRadios: getUser('radios'),
		getFlow: getUser('flow'),
		getFollowings: getUser('followings'),
		getFollowers: getUser('followers'),
		getCharts: (excf, index) =>
			getUser(`charts/${param(excf, index, 'chartType', 'tracks')}`)(excf, index),
		// Only available for the authenticated user
		getRecentTracks: getPath('/user/me/history'),
		getPermissions: getPath('/user/me/permissions'),
		getRecommendations: (excf, index) => ({
			method: 'GET',
			url: `/user/me/recommendations/${param(excf, index, 'recommendationType', 'tracks')}`,
		}),
		getSearchHistory: getPath('/search/history'),
		search: search('user', false),
		follow: (excf, index) => ({
			method: 'POST',
			url: '/user/me/followings',
			qs: { user_id: param(excf, index, 'userId') },
		}),
		unfollow: (excf, index) => ({
			method: 'DELETE',
			url: '/user/me/followings',
			qs: { user_id: param(excf, index, 'userId') },
		}),
	},
};

export default crud;
