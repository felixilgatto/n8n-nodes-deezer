import type {
	IExecuteFunctions,
	IHttpRequestOptions,
	ICredentialDataDecryptedObject,
	IDataObject,
} from 'n8n-workflow';

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

export async function requestDeezer(
	excf: IExecuteFunctions,
	request: IHttpRequestOptions,
	all: boolean = true,
): Promise<IDataObject> {
	// Make the initial request
	const response = await excf.helpers.httpRequest(request);

	// If 'all' is true, fetch additional data
	if (all && response.next) {
		let nextURL = new URL(response.next);

		// Continue fetching until no more 'next' URLs or data exceeds 1000 items
		while (true) {
			// Create a new request based on the 'next' URL
			const nextRequest = mergeRequest(request, {
				url: nextURL.pathname,
				qs: Object.fromEntries(nextURL.searchParams),
			});

			// Make the next request
			const nextResponse = await excf.helpers.httpRequest(nextRequest);

			// Append the data from the next response to the original response
			response.data.push(...nextResponse.data);

			// Check if there are more pages of data
			if (!nextResponse.next) {
				delete response.next; // No more pages, remove 'next' property
				break;
			}

			// Check if the total data exceeds 1000 items
			if (response.data.length > 1000) {
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
		query += ` ${key}:"${value}"`;
	}

	return query;
}
