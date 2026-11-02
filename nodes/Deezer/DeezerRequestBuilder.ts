import type { IDataObject, IExecuteFunctions, IHttpRequestOptions } from 'n8n-workflow';
import { buildDeezerSearchQuery } from './GenericFunctions';

/** `me` when the node returns the authenticated user, otherwise the given User ID */
function getUserId(excf: IExecuteFunctions, index: number): string {
	const returnMyUser = excf.getNodeParameter('returnMyUser', index, false) as boolean;

	return returnMyUser ? 'me' : (excf.getNodeParameter('userId', index) as string);
}

type RequestBuilder = (excf: IExecuteFunctions, index: number) => Promise<IHttpRequestOptions>;

const crud: Record<string, Record<string, RequestBuilder>> = {
	album: {
		get: async (excf: IExecuteFunctions, index: number): Promise<IHttpRequestOptions> => {
			const id = excf.getNodeParameter('id', index) as string;

			return { method: 'GET', url: `/album/${id}` };
		},
		getTracks: async (excf: IExecuteFunctions, index: number): Promise<IHttpRequestOptions> => {
			const id = excf.getNodeParameter('id', index) as string;

			return { method: 'GET', url: `/album/${id}/tracks` };
		},
		getFans: async (excf: IExecuteFunctions, index: number): Promise<IHttpRequestOptions> => {
			const id = excf.getNodeParameter('id', index) as string;

			return { method: 'GET', url: `/album/${id}/fans` };
		},
		search: async (excf: IExecuteFunctions, index: number): Promise<IHttpRequestOptions> => {
			const order = excf.getNodeParameter('order', index) as string;
			const keyword = excf.getNodeParameter('keyword', index) as string;
			const filters = excf.getNodeParameter('filters', index) as IDataObject;

			const query = buildDeezerSearchQuery(keyword, filters);

			return { method: 'GET', url: `/search/album`, qs: { order, q: query } };
		},
	},
	artist: {
		get: async (excf: IExecuteFunctions, index: number): Promise<IHttpRequestOptions> => {
			const id = excf.getNodeParameter('id', index) as string;

			return { method: 'GET', url: `/artist/${id}` };
		},
		getTopTracks: async (excf: IExecuteFunctions, index: number): Promise<IHttpRequestOptions> => {
			const id = excf.getNodeParameter('id', index) as string;

			return { method: 'GET', url: `/artist/${id}/top` };
		},
		getAlbums: async (excf: IExecuteFunctions, index: number): Promise<IHttpRequestOptions> => {
			const id = excf.getNodeParameter('id', index) as string;

			return { method: 'GET', url: `/artist/${id}/albums` };
		},
		getFans: async (excf: IExecuteFunctions, index: number): Promise<IHttpRequestOptions> => {
			const id = excf.getNodeParameter('id', index) as string;

			return { method: 'GET', url: `/artist/${id}/fans` };
		},
		getRelatedArtists: async (
			excf: IExecuteFunctions,
			index: number,
		): Promise<IHttpRequestOptions> => {
			const id = excf.getNodeParameter('id', index) as string;

			return { method: 'GET', url: `/artist/${id}/related` };
		},
		getRadio: async (excf: IExecuteFunctions, index: number): Promise<IHttpRequestOptions> => {
			const id = excf.getNodeParameter('id', index) as string;

			return { method: 'GET', url: `/artist/${id}/radio` };
		},
		getPlaylists: async (excf: IExecuteFunctions, index: number): Promise<IHttpRequestOptions> => {
			const id = excf.getNodeParameter('id', index) as string;

			return { method: 'GET', url: `/artist/${id}/playlists` };
		},
		search: async (excf: IExecuteFunctions, index: number): Promise<IHttpRequestOptions> => {
			const order = excf.getNodeParameter('order', index) as string;
			const keyword = excf.getNodeParameter('keyword', index) as string;
			const filters = excf.getNodeParameter('filters', index) as IDataObject;

			const query = buildDeezerSearchQuery(keyword, filters);

			return { method: 'GET', url: `/search/artist`, qs: { order, q: query } };
		},
	},
	playlist: {
		get: async (excf: IExecuteFunctions, index: number): Promise<IHttpRequestOptions> => {
			const id = excf.getNodeParameter('id', index) as string;

			return { method: 'GET', url: `/playlist/${id}` };
		},
		create: async (excf: IExecuteFunctions, index: number): Promise<IHttpRequestOptions> => {
			const name = excf.getNodeParameter('name', index) as string;

			return { method: 'POST', url: '/user/me/playlists', qs: { title: name } };
		},
		delete: async (excf: IExecuteFunctions, index: number): Promise<IHttpRequestOptions> => {
			const id = excf.getNodeParameter('id', index) as string;

			return { method: 'DELETE', url: `/playlist/${id}` };
		},
		getFans: async (excf: IExecuteFunctions, index: number): Promise<IHttpRequestOptions> => {
			const id = excf.getNodeParameter('id', index) as string;

			return { method: 'GET', url: `/playlist/${id}/fans` };
		},
		getTracks: async (excf: IExecuteFunctions, index: number): Promise<IHttpRequestOptions> => {
			const id = excf.getNodeParameter('id', index) as string;

			return { method: 'GET', url: `/playlist/${id}/tracks` };
		},
		add: async (excf: IExecuteFunctions, index: number): Promise<IHttpRequestOptions> => {
			const id = excf.getNodeParameter('id', index) as string;
			const trackId = excf.getNodeParameter('trackID', index) as string;

			return { method: 'POST', url: `/playlist/${id}/tracks`, qs: { songs: trackId } };
		},
		remove: async (excf: IExecuteFunctions, index: number): Promise<IHttpRequestOptions> => {
			const id = excf.getNodeParameter('id', index) as string;
			const trackId = excf.getNodeParameter('trackID', index) as string;

			return { method: 'DELETE', url: `/playlist/${id}/tracks`, qs: { songs: trackId } };
		},
		getRadio: async (excf: IExecuteFunctions, index: number): Promise<IHttpRequestOptions> => {
			const id = excf.getNodeParameter('id', index) as string;

			return { method: 'GET', url: `/playlist/${id}/radio` };
		},
		search: async (excf: IExecuteFunctions, index: number): Promise<IHttpRequestOptions> => {
			const order = excf.getNodeParameter('order', index) as string;
			const keyword = excf.getNodeParameter('keyword', index) as string;
			const filters = excf.getNodeParameter('filters', index) as IDataObject;

			const query = buildDeezerSearchQuery(keyword, filters);

			return { method: 'GET', url: `/search/playlist`, qs: { order, q: query } };
		},
	},
	track: {
		get: async (excf: IExecuteFunctions, index: number): Promise<IHttpRequestOptions> => {
			const id = excf.getNodeParameter('id', index) as string;

			return { method: 'GET', url: `/track/${id}` };
		},
		search: async (excf: IExecuteFunctions, index: number): Promise<IHttpRequestOptions> => {
			const order = excf.getNodeParameter('order', index) as string;
			const keyword = excf.getNodeParameter('keyword', index) as string;
			const filters = excf.getNodeParameter('filters', index) as IDataObject;

			const query = buildDeezerSearchQuery(keyword, filters);

			return { method: 'GET', url: `/search/track`, qs: { order, q: query } };
		},
	},
	chart: {
		get: async (): Promise<IHttpRequestOptions> => {
			return { method: 'GET', url: '/chart' };
		},
		getArtists: async (): Promise<IHttpRequestOptions> => {
			return { method: 'GET', url: '/chart/0/artists' };
		},
		getAlbums: async (): Promise<IHttpRequestOptions> => {
			return { method: 'GET', url: '/chart/0/albums' };
		},
		getTracks: async (): Promise<IHttpRequestOptions> => {
			return { method: 'GET', url: '/chart/0/tracks' };
		},
		getPlaylists: async (): Promise<IHttpRequestOptions> => {
			return { method: 'GET', url: '/chart/0/playlists' };
		},
		getPodcasts: async (): Promise<IHttpRequestOptions> => {
			return { method: 'GET', url: '/chart/0/podcasts' };
		},
	},
	user: {
		get: async (excf: IExecuteFunctions, index: number): Promise<IHttpRequestOptions> => {
			const id = getUserId(excf, index);

			return { method: 'GET', url: `/user/${id}` };
		},
		getPlaylists: async (excf: IExecuteFunctions, index: number): Promise<IHttpRequestOptions> => {
			const id = getUserId(excf, index);

			return { method: 'GET', url: `/user/${id}/playlists` };
		},
		getFavoriteTracks: async (
			excf: IExecuteFunctions,
			index: number,
		): Promise<IHttpRequestOptions> => {
			const id = getUserId(excf, index);

			return { method: 'GET', url: `/user/${id}/tracks` };
		},
		getFavoriteAlbums: async (
			excf: IExecuteFunctions,
			index: number,
		): Promise<IHttpRequestOptions> => {
			const id = getUserId(excf, index);

			return { method: 'GET', url: `/user/${id}/albums` };
		},
		getFavoriteArtists: async (
			excf: IExecuteFunctions,
			index: number,
		): Promise<IHttpRequestOptions> => {
			const id = getUserId(excf, index);

			return { method: 'GET', url: `/user/${id}/artists` };
		},
		getFavoritePodcasts: async (
			excf: IExecuteFunctions,
			index: number,
		): Promise<IHttpRequestOptions> => {
			const id = getUserId(excf, index);

			return { method: 'GET', url: `/user/${id}/podcasts` };
		},
		getFavoriteRadios: async (
			excf: IExecuteFunctions,
			index: number,
		): Promise<IHttpRequestOptions> => {
			const id = getUserId(excf, index);

			return { method: 'GET', url: `/user/${id}/radios` };
		},
		getFlow: async (excf: IExecuteFunctions, index: number): Promise<IHttpRequestOptions> => {
			const id = getUserId(excf, index);

			return { method: 'GET', url: `/user/${id}/flow` };
		},
		getFollowings: async (excf: IExecuteFunctions, index: number): Promise<IHttpRequestOptions> => {
			const id = getUserId(excf, index);

			return { method: 'GET', url: `/user/${id}/followings` };
		},
		getFollowers: async (excf: IExecuteFunctions, index: number): Promise<IHttpRequestOptions> => {
			const id = getUserId(excf, index);

			return { method: 'GET', url: `/user/${id}/followers` };
		},
		getRecentTracks: async (
			excf: IExecuteFunctions,
			index: number,
		): Promise<IHttpRequestOptions> => {
			const id = getUserId(excf, index);

			return { method: 'GET', url: `/user/${id}/history` };
		},
	},
	podcast: {
		get: async (excf: IExecuteFunctions, index: number): Promise<IHttpRequestOptions> => {
			const id = excf.getNodeParameter('id', index) as string;

			return { method: 'GET', url: `/podcast/${id}` };
		},
		getEpisodes: async (excf: IExecuteFunctions, index: number): Promise<IHttpRequestOptions> => {
			const id = excf.getNodeParameter('id', index) as string;

			return { method: 'GET', url: `/podcast/${id}/episodes` };
		},
		search: async (excf: IExecuteFunctions, index: number): Promise<IHttpRequestOptions> => {
			const order = excf.getNodeParameter('order', index) as string;
			const keyword = excf.getNodeParameter('keyword', index) as string;
			const filters = excf.getNodeParameter('filters', index) as IDataObject;

			const query = buildDeezerSearchQuery(keyword, filters);

			return { method: 'GET', url: `/search/podcast`, qs: { order, q: query } };
		},
	},
};

export default crud;
