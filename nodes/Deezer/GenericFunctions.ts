import {
	NodeApiError,
	type IExecuteFunctions,
	type IHttpRequestOptions,
	type ICredentialDataDecryptedObject,
	type IDataObject,
	type JsonObject,
} from 'n8n-workflow';

/** Max items fetched by "Return All" before stopping (the `next` URL is kept) */
const RETURN_ALL_MAX_ITEMS = 1000;

export function getAccessToken(credentials: ICredentialDataDecryptedObject): string {
	const oauthTokenData = (credentials.oauthTokenData ?? {}) as IDataObject;

	return oauthTokenData.access_token as string;
}

/**
 * Returns a new request where `qs` and `headers` are merged one level deep,
 * without mutating any of the inputs.
 */
export function mergeRequest(
	base: IHttpRequestOptions,
	override: Partial<IHttpRequestOptions>,
): IHttpRequestOptions {
	return {
		...base,
		...override,
		qs: { ...(base.qs ?? {}), ...(override.qs ?? {}) },
		headers: { ...(base.headers ?? {}), ...(override.headers ?? {}) },
	};
}

/**
 * Deezer answers errors with HTTP 200 and a body like
 * `{ "error": { "type": "DataException", "message": "no data", "code": 800 } }`.
 */
async function httpRequestDeezer(excf: IExecuteFunctions, request: IHttpRequestOptions) {
	const response = await excf.helpers.httpRequest(request);

	if (typeof response === 'object' && response !== null && response.error) {
		const error = response.error as IDataObject;

		throw new NodeApiError(excf.getNode(), error as JsonObject, {
			message: `Deezer: ${error.message ?? 'Unknown error'}`,
			description: `${error.type ?? 'Error'}${error.code !== undefined ? ` (code ${error.code})` : ''}`,
			httpCode: String(error.code ?? ''),
		});
	}

	return response;
}

export async function requestDeezer(
	excf: IExecuteFunctions,
	request: IHttpRequestOptions,
	all: boolean = true,
): Promise<IDataObject> {
	// Make the initial request
	const response = await httpRequestDeezer(excf, request);

	// If 'all' is true, fetch additional data
	if (all && response.next) {
		let nextURL = new URL(response.next);

		// Continue fetching until no more 'next' URLs or the item cap is reached
		while (true) {
			// Create a new request based on the 'next' URL
			const nextRequest = mergeRequest(request, {
				url: nextURL.pathname,
				qs: Object.fromEntries(nextURL.searchParams),
			});

			// Make the next request
			const nextResponse = await httpRequestDeezer(excf, nextRequest);

			// Append the data from the next response to the original response
			response.data.push(...nextResponse.data);

			// Check if there are more pages of data
			if (!nextResponse.next) {
				delete response.next; // No more pages, remove 'next' property
				break;
			}

			// Stop at the item cap
			if (response.data.length >= RETURN_ALL_MAX_ITEMS) {
				response.next = nextResponse.next; // Store 'next' URL for potential future requests
				break;
			}

			// Update the 'next' URL for the next iteration
			nextURL = new URL(nextResponse.next);
		}
	}

	// Return the combined response
	return response;
}

export function buildDeezerSearchQuery(keyword: string, filters: IDataObject): string {
	let query = keyword.toString();

	for (const [key, value] of Object.entries(filters)) {
		// Skip filters added in the UI but left empty
		if (value === '' || value === undefined || value === null) continue;
		query += ` ${key}:"${value}"`;
	}

	return query;
}
