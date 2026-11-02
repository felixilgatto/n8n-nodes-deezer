import type { INodeProperties } from 'n8n-workflow';

/** Operations that return a paginated `{ data, total, next }` list */
export const LIST_OPERATIONS = [
	'getAlbums',
	'getAll',
	'getArtists',
	'getCharts',
	'getEpisodes',
	'getFans',
	'getFavoriteAlbums',
	'getFavoriteArtists',
	'getFavoritePodcasts',
	'getFavoriteRadios',
	'getFavoriteTracks',
	'getFlow',
	'getFollowers',
	'getFollowings',
	'getGenres',
	'getLists',
	'getPlaylists',
	'getPodcasts',
	'getRadio',
	'getRadios',
	'getRecentTracks',
	'getRecommendations',
	'getRelatedArtists',
	'getReleases',
	'getSearchHistory',
	'getSelection',
	'getTopTracks',
	'getTracks',
	'search',
];

/** Operations that only work with an authenticated Deezer user */
export const AUTH_REQUIRED_OPERATIONS: Record<string, string[]> = {
	album: ['addToFavorites', 'removeFromFavorites'],
	artist: ['addToFavorites', 'removeFromFavorites'],
	playlist: [
		'add',
		'addToFavorites',
		'create',
		'delete',
		'remove',
		'removeFromFavorites',
		'reorderTracks',
		'update',
	],
	podcast: ['addToFavorites', 'removeFromFavorites'],
	radio: ['addToFavorites', 'removeFromFavorites'],
	track: ['addToFavorites', 'removeFromFavorites'],
	user: [
		'follow',
		'getPermissions',
		'getRecentTracks',
		'getRecommendations',
		'getSearchHistory',
		'unfollow',
	],
};

/** User operations that target a user chosen with "Return My User" / "User ID" */
const USER_TARGET_OPERATIONS = [
	'get',
	'getCharts',
	'getFavoriteAlbums',
	'getFavoriteArtists',
	'getFavoritePodcasts',
	'getFavoriteRadios',
	'getFavoriteTracks',
	'getFlow',
	'getFollowers',
	'getFollowings',
	'getPlaylists',
];

/** Search operations that support `order` and advanced filters */
const ADVANCED_SEARCH_RESOURCES = ['album', 'artist', 'playlist', 'podcast', 'track'];

const authenticationOptions: INodeProperties['options'] = [
	{
		name: 'None',
		value: 'none',
		description: 'Public catalog only (search, albums, artists, charts, etc.)',
	},
	{
		name: 'OAuth2',
		value: 'oAuth2',
		description: 'Required for your own account, favorites and playlists management',
	},
];

/** One "<Resource> ID" field per resource, so the label matches what is asked */
function idField(resource: string, label: string, hideOperations: string[] = []): INodeProperties {
	return {
		displayName: `${label} ID`,
		name: 'id',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: { resource: [resource] },
			...(hideOperations.length ? { hide: { operation: hideOperations } } : {}),
		},
		placeholder: '1234567',
		description: `ID of the ${label.toLowerCase()} (visible in its deezer.com URL)`,
	};
}

export const deezerProperties: INodeProperties[] = [
	// ----------------------------------------------------------------
	//         Authentication
	// ----------------------------------------------------------------
	{
		displayName: 'Authentication',
		name: 'authentication',
		type: 'options',
		options: authenticationOptions,
		default: 'oAuth2',
		displayOptions: { show: { '@version': [1] } },
	},
	{
		displayName: 'Authentication',
		name: 'authentication',
		type: 'options',
		options: authenticationOptions,
		default: 'none',
		displayOptions: { show: { '@version': [1.1] } },
	},
	// ----------------------------------------------------------------
	//         Resource
	// ----------------------------------------------------------------
	{
		displayName: 'Resource',
		name: 'resource',
		type: 'options',
		noDataExpression: true,
		options: [
			{ name: 'Album', value: 'album' },
			{ name: 'Artist', value: 'artist' },
			{ name: 'Chart', value: 'chart' },
			{ name: 'Editorial', value: 'editorial' },
			{ name: 'Episode', value: 'episode' },
			{ name: 'Genre', value: 'genre' },
			{ name: 'Playlist', value: 'playlist' },
			{ name: 'Podcast', value: 'podcast' },
			{ name: 'Radio', value: 'radio' },
			{ name: 'Track', value: 'track' },
			{ name: 'User', value: 'user' },
		],
		default: 'album',
	},
	// ----------------------------------------------------------------
	//         Album
	// ----------------------------------------------------------------
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['album'] } },
		options: [
			{
				name: 'Add to Favorites',
				value: 'addToFavorites',
				description: "Add an album to the authenticated user's favorites",
				action: 'Add an album to favorites',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get an album by ID',
				action: 'Get an album',
			},
			{
				name: 'Get Fans',
				value: 'getFans',
				description: 'Get the users who added an album to their favorites',
				action: 'Get the fans of an album',
			},
			{
				name: 'Get Tracks',
				value: 'getTracks',
				description: 'Get the tracks of an album',
				action: 'Get the tracks of an album',
			},
			{
				name: 'Remove From Favorites',
				value: 'removeFromFavorites',
				description: "Remove an album from the authenticated user's favorites",
				action: 'Remove an album from favorites',
			},
			{
				name: 'Search',
				value: 'search',
				description: 'Search albums by keyword',
				action: 'Search albums',
			},
		],
		default: 'get',
	},
	// ----------------------------------------------------------------
	//         Artist
	// ----------------------------------------------------------------
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['artist'] } },
		options: [
			{
				name: 'Add to Favorites',
				value: 'addToFavorites',
				description: "Add an artist to the authenticated user's favorites",
				action: 'Add an artist to favorites',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get an artist by ID',
				action: 'Get an artist',
			},
			{
				name: 'Get Albums',
				value: 'getAlbums',
				description: 'Get the albums of an artist',
				action: 'Get the albums of an artist',
			},
			{
				name: 'Get Fans',
				value: 'getFans',
				description: 'Get the fans of an artist',
				action: 'Get the fans of an artist',
			},
			{
				name: 'Get Playlists',
				value: 'getPlaylists',
				description: 'Get the playlists featuring an artist',
				action: 'Get the playlists of an artist',
			},
			{
				name: 'Get Radio',
				value: 'getRadio',
				description: 'Get a list of tracks similar to an artist',
				action: 'Get the radio of an artist',
			},
			{
				name: 'Get Related Artists',
				value: 'getRelatedArtists',
				description: 'Get artists similar to an artist',
				action: 'Get the related artists of an artist',
			},
			{
				name: 'Get Top Tracks',
				value: 'getTopTracks',
				description: 'Get the most popular tracks of an artist',
				action: 'Get the top tracks of an artist',
			},
			{
				name: 'Remove From Favorites',
				value: 'removeFromFavorites',
				description: "Remove an artist from the authenticated user's favorites",
				action: 'Remove an artist from favorites',
			},
			{
				name: 'Search',
				value: 'search',
				description: 'Search artists by keyword',
				action: 'Search artists',
			},
		],
		default: 'get',
	},
	// ----------------------------------------------------------------
	//         Chart
	// ----------------------------------------------------------------
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['chart'] } },
		options: [
			{
				name: 'Get Albums',
				value: 'getAlbums',
				description: 'Get the most popular albums',
				action: 'Get popular albums',
			},
			{
				name: 'Get All',
				value: 'get',
				description: 'Get the top tracks, albums, artists, playlists and podcasts at once',
				action: 'Get the full chart',
			},
			{
				name: 'Get Artists',
				value: 'getArtists',
				description: 'Get the most popular artists',
				action: 'Get popular artists',
			},
			{
				name: 'Get Playlists',
				value: 'getPlaylists',
				description: 'Get the most popular playlists',
				action: 'Get popular playlists',
			},
			{
				name: 'Get Podcasts',
				value: 'getPodcasts',
				description: 'Get the most popular podcasts',
				action: 'Get popular podcasts',
			},
			{
				name: 'Get Tracks',
				value: 'getTracks',
				description: 'Get the most popular tracks',
				action: 'Get popular tracks',
			},
		],
		default: 'get',
	},
	// ----------------------------------------------------------------
	//         Editorial
	// ----------------------------------------------------------------
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['editorial'] } },
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get an editorial by ID',
				action: 'Get an editorial',
			},
			{
				name: 'Get Chart',
				value: 'getChart',
				description: 'Get the chart of an editorial',
				action: 'Get the chart of an editorial',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get the list of editorials',
				action: 'Get many editorials',
			},
			{
				name: 'Get Releases',
				value: 'getReleases',
				description: 'Get the new releases of an editorial',
				action: 'Get the releases of an editorial',
			},
			{
				name: 'Get Selection',
				value: 'getSelection',
				description: 'Get the albums selected by the Deezer editors',
				action: 'Get the selection of an editorial',
			},
		],
		default: 'getAll',
	},
	// ----------------------------------------------------------------
	//         Episode
	// ----------------------------------------------------------------
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['episode'] } },
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get a podcast episode by ID',
				action: 'Get an episode',
			},
		],
		default: 'get',
	},
	// ----------------------------------------------------------------
	//         Genre
	// ----------------------------------------------------------------
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['genre'] } },
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get a genre by ID',
				action: 'Get a genre',
			},
			{
				name: 'Get Artists',
				value: 'getArtists',
				description: 'Get the artists of a genre',
				action: 'Get the artists of a genre',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get the list of genres',
				action: 'Get many genres',
			},
			{
				name: 'Get Podcasts',
				value: 'getPodcasts',
				description: 'Get the podcasts of a genre',
				action: 'Get the podcasts of a genre',
			},
			{
				name: 'Get Radios',
				value: 'getRadios',
				description: 'Get the radios of a genre',
				action: 'Get the radios of a genre',
			},
		],
		default: 'getAll',
	},
	// ----------------------------------------------------------------
	//         Playlist
	// ----------------------------------------------------------------
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['playlist'] } },
		options: [
			{
				name: 'Add to Favorites',
				value: 'addToFavorites',
				description: "Add a playlist to the authenticated user's favorites",
				action: 'Add a playlist to favorites',
			},
			{
				name: 'Add Tracks',
				value: 'add',
				description: 'Add one or more tracks to a playlist',
				action: 'Add tracks to a playlist',
			},
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new playlist for the authenticated user',
				action: 'Create a playlist',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a playlist',
				action: 'Delete a playlist',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a playlist by ID',
				action: 'Get a playlist',
			},
			{
				name: 'Get Fans',
				value: 'getFans',
				description: 'Get the fans of a playlist',
				action: 'Get the fans of a playlist',
			},
			{
				name: 'Get Radio',
				value: 'getRadio',
				description: 'Get tracks recommended from a playlist',
				action: 'Get the radio of a playlist',
			},
			{
				name: 'Get Tracks',
				value: 'getTracks',
				description: 'Get the tracks of a playlist',
				action: 'Get the tracks of a playlist',
			},
			{
				name: 'Remove From Favorites',
				value: 'removeFromFavorites',
				description: "Remove a playlist from the authenticated user's favorites",
				action: 'Remove a playlist from favorites',
			},
			{
				name: 'Remove Tracks',
				value: 'remove',
				description: 'Remove one or more tracks from a playlist',
				action: 'Remove tracks from a playlist',
			},
			{
				name: 'Reorder Tracks',
				value: 'reorderTracks',
				description: 'Set the order of the tracks of a playlist',
				action: 'Reorder the tracks of a playlist',
			},
			{
				name: 'Search',
				value: 'search',
				description: 'Search playlists by keyword',
				action: 'Search playlists',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update the title, description or visibility of a playlist',
				action: 'Update a playlist',
			},
		],
		default: 'get',
	},
	// ----------------------------------------------------------------
	//         Podcast
	// ----------------------------------------------------------------
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['podcast'] } },
		options: [
			{
				name: 'Add to Favorites',
				value: 'addToFavorites',
				description: "Add a podcast to the authenticated user's favorites",
				action: 'Add a podcast to favorites',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a podcast by ID',
				action: 'Get a podcast',
			},
			{
				name: 'Get Episodes',
				value: 'getEpisodes',
				description: 'Get the episodes of a podcast',
				action: 'Get the episodes of a podcast',
			},
			{
				name: 'Remove From Favorites',
				value: 'removeFromFavorites',
				description: "Remove a podcast from the authenticated user's favorites",
				action: 'Remove a podcast from favorites',
			},
			{
				name: 'Search',
				value: 'search',
				description: 'Search podcasts by keyword',
				action: 'Search podcasts',
			},
		],
		default: 'get',
	},
	// ----------------------------------------------------------------
	//         Radio
	// ----------------------------------------------------------------
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['radio'] } },
		options: [
			{
				name: 'Add to Favorites',
				value: 'addToFavorites',
				description: "Add a radio to the authenticated user's favorites",
				action: 'Add a radio to favorites',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a radio by ID',
				action: 'Get a radio',
			},
			{
				name: 'Get Genres',
				value: 'getGenres',
				description: 'Get the radios grouped by genre',
				action: 'Get radios by genre',
			},
			{
				name: 'Get Lists',
				value: 'getLists',
				description: 'Get the radios split into lists',
				action: 'Get radio lists',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get the list of radios',
				action: 'Get many radios',
			},
			{
				name: 'Get Tracks',
				value: 'getTracks',
				description: 'Get the tracks of a radio',
				action: 'Get the tracks of a radio',
			},
			{
				name: 'Remove From Favorites',
				value: 'removeFromFavorites',
				description: "Remove a radio from the authenticated user's favorites",
				action: 'Remove a radio from favorites',
			},
			{
				name: 'Search',
				value: 'search',
				description: 'Search radios by keyword',
				action: 'Search radios',
			},
		],
		default: 'getAll',
	},
	// ----------------------------------------------------------------
	//         Track
	// ----------------------------------------------------------------
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['track'] } },
		options: [
			{
				name: 'Add to Favorites',
				value: 'addToFavorites',
				description: "Add a track to the authenticated user's favorites",
				action: 'Add a track to favorites',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a track by ID',
				action: 'Get a track',
			},
			{
				name: 'Remove From Favorites',
				value: 'removeFromFavorites',
				description: "Remove a track from the authenticated user's favorites",
				action: 'Remove a track from favorites',
			},
			{
				name: 'Search',
				value: 'search',
				description: 'Search tracks by keyword',
				action: 'Search tracks',
			},
		],
		default: 'get',
	},
	// ----------------------------------------------------------------
	//         User
	// ----------------------------------------------------------------
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['user'] } },
		options: [
			{
				name: 'Follow',
				value: 'follow',
				description: 'Follow a user with the authenticated account',
				action: 'Follow a user',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a user profile',
				action: 'Get a user',
			},
			{
				name: 'Get Charts',
				value: 'getCharts',
				description: 'Get the most listened tracks, albums, artists or playlists of a user',
				action: 'Get the charts of a user',
			},
			{
				name: 'Get Favorite Albums',
				value: 'getFavoriteAlbums',
				description: 'Get the favorite albums of a user',
				action: 'Get the favorite albums of a user',
			},
			{
				name: 'Get Favorite Artists',
				value: 'getFavoriteArtists',
				description: 'Get the favorite artists of a user',
				action: 'Get the favorite artists of a user',
			},
			{
				name: 'Get Favorite Podcasts',
				value: 'getFavoritePodcasts',
				description: 'Get the favorite podcasts of a user',
				action: 'Get the favorite podcasts of a user',
			},
			{
				name: 'Get Favorite Radios',
				value: 'getFavoriteRadios',
				description: 'Get the favorite radios of a user',
				action: 'Get the favorite radios of a user',
			},
			{
				name: 'Get Favorite Tracks',
				value: 'getFavoriteTracks',
				description: 'Get the favorite tracks of a user',
				action: 'Get the favorite tracks of a user',
			},
			{
				name: 'Get Flow',
				value: 'getFlow',
				description: 'Get the personalized Flow tracks of a user',
				action: 'Get the flow of a user',
			},
			{
				name: 'Get Followers',
				value: 'getFollowers',
				description: 'Get the followers of a user',
				action: 'Get the followers of a user',
			},
			{
				name: 'Get Followings',
				value: 'getFollowings',
				description: 'Get the users followed by a user',
				action: 'Get the followings of a user',
			},
			{
				name: 'Get Permissions',
				value: 'getPermissions',
				description: 'Get the permissions granted to the app by the authenticated user',
				action: 'Get the permissions of the authenticated user',
			},
			{
				name: 'Get Playlists',
				value: 'getPlaylists',
				description: 'Get the playlists of a user',
				action: 'Get the playlists of a user',
			},
			{
				name: 'Get Recent Tracks',
				value: 'getRecentTracks',
				description: 'Get the listening history of the authenticated user',
				action: 'Get the recent tracks of the authenticated user',
			},
			{
				name: 'Get Recommendations',
				value: 'getRecommendations',
				description: 'Get recommendations for the authenticated user',
				action: 'Get recommendations for the authenticated user',
			},
			{
				name: 'Get Search History',
				value: 'getSearchHistory',
				description: 'Get the recent searches of the authenticated user',
				action: 'Get the search history of the authenticated user',
			},
			{
				name: 'Search',
				value: 'search',
				description: 'Search users by name',
				action: 'Search users',
			},
			{
				name: 'Unfollow',
				value: 'unfollow',
				description: 'Stop following a user with the authenticated account',
				action: 'Unfollow a user',
			},
		],
		default: 'get',
	},
	// ----------------------------------------------------------------
	//         IDs
	// ----------------------------------------------------------------
	idField('album', 'Album', ['search']),
	idField('artist', 'Artist', ['search']),
	idField('editorial', 'Editorial', ['getAll']),
	idField('episode', 'Episode'),
	idField('genre', 'Genre', ['getAll']),
	idField('playlist', 'Playlist', ['search', 'create']),
	idField('podcast', 'Podcast', ['search']),
	idField('radio', 'Radio', ['search', 'getAll', 'getGenres', 'getLists']),
	idField('track', 'Track', ['search']),
	{
		displayName: 'Genre ID',
		name: 'genreId',
		type: 'number',
		default: 0,
		displayOptions: { show: { resource: ['chart'] } },
		description: 'Get the chart of a specific genre. 0 means all genres.',
	},
	// ----------------------------------------------------------------
	//         User target
	// ----------------------------------------------------------------
	{
		displayName: 'Return My User',
		name: 'returnMyUser',
		type: 'boolean',
		default: true,
		required: true,
		displayOptions: {
			show: {
				resource: ['user'],
				authentication: ['oAuth2'],
				operation: USER_TARGET_OPERATIONS,
			},
		},
		description: 'Whether to return the logged in user or a specific user',
	},
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['user'],
				returnMyUser: [false],
				authentication: ['oAuth2'],
				operation: USER_TARGET_OPERATIONS,
			},
		},
		placeholder: '1234567',
	},
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['user'],
				authentication: ['none'],
				operation: USER_TARGET_OPERATIONS,
			},
		},
		placeholder: '1234567',
	},
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['follow', 'unfollow'],
			},
		},
		placeholder: '1234567',
		description: 'ID of the user to follow or unfollow',
	},
	{
		displayName: 'Chart Type',
		name: 'chartType',
		type: 'options',
		default: 'tracks',
		options: [
			{ name: 'Albums', value: 'albums' },
			{ name: 'Artists', value: 'artists' },
			{ name: 'Playlists', value: 'playlists' },
			{ name: 'Tracks', value: 'tracks' },
		],
		displayOptions: { show: { resource: ['user'], operation: ['getCharts'] } },
	},
	{
		displayName: 'Recommendation Type',
		name: 'recommendationType',
		type: 'options',
		default: 'tracks',
		options: [
			{ name: 'Albums', value: 'albums' },
			{ name: 'Artists', value: 'artists' },
			{ name: 'Playlists', value: 'playlists' },
			{ name: 'Radios', value: 'radios' },
			{ name: 'Releases', value: 'releases' },
			{ name: 'Tracks', value: 'tracks' },
		],
		displayOptions: { show: { resource: ['user'], operation: ['getRecommendations'] } },
	},
	// ----------------------------------------------------------------
	//         Search
	// ----------------------------------------------------------------
	{
		displayName: 'Search',
		placeholder: 'Keyword',
		required: true,
		name: 'keyword',
		type: 'string',
		default: '',
		description: 'The keyword term to search for',
		displayOptions: { show: { operation: ['search'] } },
	},
	{
		displayName: 'Order',
		name: 'order',
		type: 'options',
		required: true,
		default: 'RANKING',
		options: [
			{ name: 'Album Ascending', value: 'ALBUM_ASC' },
			{ name: 'Album Descending', value: 'ALBUM_DESC' },
			{ name: 'Artist Ascending', value: 'ARTIST_ASC' },
			{ name: 'Artist Descending', value: 'ARTIST_DESC' },
			{ name: 'Duration Ascending', value: 'DURATION_ASC' },
			{ name: 'Duration Descending', value: 'DURATION_DESC' },
			{ name: 'Ranking', value: 'RANKING' },
			{ name: 'Rating Ascending', value: 'RATING_ASC' },
			{ name: 'Rating Descending', value: 'RATING_DESC' },
			{ name: 'Track Ascending', value: 'TRACK_ASC' },
			{ name: 'Track Descending', value: 'TRACK_DESC' },
		],
		displayOptions: {
			show: { resource: ADVANCED_SEARCH_RESOURCES, operation: ['search'] },
		},
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: { resource: ADVANCED_SEARCH_RESOURCES, operation: ['search'] },
		},
		options: [
			{
				displayName: 'With Album',
				name: 'album',
				type: 'string',
				default: '',
			},
			{
				displayName: 'With Artist',
				name: 'artist',
				type: 'string',
				default: '',
			},
			{
				displayName: 'With Duration Maximum',
				name: 'dur_max',
				type: 'number',
				default: 999,
				description: 'In seconds',
			},
			{
				displayName: 'With Duration Minimum',
				name: 'dur_min',
				type: 'number',
				default: 0,
				description: 'In seconds',
			},
			{
				displayName: 'With Label',
				name: 'label',
				type: 'string',
				default: '',
			},
			{
				displayName: 'With Tempo(BPM) Maximum',
				name: 'bpm_max',
				type: 'number',
				default: 999,
			},
			{
				displayName: 'With Tempo(BPM) Minimum',
				name: 'bpm_min',
				type: 'number',
				default: 0,
			},
			{
				displayName: 'With Track',
				name: 'track',
				type: 'string',
				default: '',
			},
		],
	},
	// ----------------------------------------------------------------
	//         Playlist management
	// ----------------------------------------------------------------
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { resource: ['playlist'], operation: ['create'] } },
		placeholder: 'Favorite Songs',
		description: 'Name of the playlist to create',
	},
	{
		displayName: 'Track IDs',
		name: 'trackID',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { resource: ['playlist'], operation: ['add', 'remove'] } },
		placeholder: '3135556,3135553',
		description: 'One track ID, or several separated by commas',
	},
	{
		displayName: 'Track IDs',
		name: 'trackID',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { resource: ['playlist'], operation: ['reorderTracks'] } },
		placeholder: '3135556,3135553',
		description: 'All the track IDs of the playlist, separated by commas, in the new order',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['playlist'], operation: ['update'] } },
		options: [
			{
				displayName: 'Collaborative',
				name: 'collaborative',
				type: 'boolean',
				default: false,
				description: 'Whether other users can add tracks to the playlist',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Public',
				name: 'public',
				type: 'boolean',
				default: true,
				description: 'Whether the playlist is visible to other users',
			},
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				default: '',
			},
		],
	},
	// ----------------------------------------------------------------
	//         Pagination
	// ----------------------------------------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: { show: { operation: LIST_OPERATIONS } },
		description: 'Whether to return all results or only up to a given limit',
		hint: 'Stops after 1000 items',
	},
	{
		displayName: 'Offset',
		name: 'offset',
		type: 'number',
		default: 0,
		displayOptions: { show: { operation: LIST_OPERATIONS, returnAll: [false] } },
		typeOptions: { minValue: 0 },
		description: 'The offset of the first object you want to get',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		displayOptions: { show: { operation: LIST_OPERATIONS, returnAll: [false] } },
		typeOptions: { minValue: 1 },
		description: 'Max number of results to return',
	},
];
