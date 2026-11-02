import {
	NodeApiError,
	NodeOperationError,
	NodeConnectionTypes,
	type IExecuteFunctions,
	type JsonObject,
	type INodeExecutionData,
	type INodeType,
	type INodeTypeDescription,
	type IHttpRequestOptions,
} from 'n8n-workflow';

import { AUTH_REQUIRED_OPERATIONS, LIST_OPERATIONS, deezerProperties } from './DeezerDescription';
import crud from './DeezerRequestBuilder';
import { getAccessToken, mergeRequest, requestDeezer } from './GenericFunctions';

const BASE_URL = 'https://api.deezer.com';
const DEFAULT_OFFSET = 0;
const DEFAULT_LIMIT = 50;
/** Page size used by "Return All" (Deezer accepts up to 100) */
const RETURN_ALL_PAGE_SIZE = 100;

export class Deezer implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Deezer',
		name: 'deezer',
		icon: { light: 'file:../../icons/deezer.svg', dark: 'file:../../icons/deezer.svg' },
		group: ['input'],
		version: [1, 1.1],
		defaultVersion: 1.1,
		description: 'Search the Deezer catalog and manage your library and playlists',
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		defaults: {
			name: 'Deezer',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'deezerOAuth2Api',
				required: true,
				displayOptions: {
					show: {
						authentication: ['oAuth2'],
					},
				},
			},
		],
		properties: deezerProperties,
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const operation = this.getNodeParameter('operation', 0) as string;
		const resource = this.getNodeParameter('resource', 0) as string;
		const authentication = this.getNodeParameter('authentication', 0, 'oAuth2') as string;

		const buildRequest = crud[resource]?.[operation];
		if (!buildRequest) {
			throw new NodeOperationError(
				this.getNode(),
				`The operation "${operation}" is not supported for "${resource}"`,
			);
		}

		let request: IHttpRequestOptions = {
			baseURL: BASE_URL,
			headers: {
				'User-Agent': 'n8n',
				Accept: 'application/json',
			},
			qs: {},
			json: true,
			url: '',
		};

		if (authentication === 'oAuth2') {
			const credentials = await this.getCredentials('deezerOAuth2Api');
			request = mergeRequest(request, { qs: { access_token: getAccessToken(credentials) } });
		} else if (AUTH_REQUIRED_OPERATIONS[resource]?.includes(operation)) {
			throw new NodeOperationError(
				this.getNode(),
				`The "${operation}" operation on "${resource}" requires a Deezer account`,
				{ description: "Set 'Authentication' to 'OAuth2' and select Deezer credentials" },
			);
		}

		const isList = LIST_OPERATIONS.includes(operation);

		for (let i = 0; i < items.length; i++) {
			try {
				let itemRequest = mergeRequest(request, buildRequest(this, i));

				const returnAll = isList && (this.getNodeParameter('returnAll', i, false) as boolean);

				if (isList) {
					const offset = this.getNodeParameter('offset', i, DEFAULT_OFFSET) as number;
					const limit = this.getNodeParameter('limit', i, DEFAULT_LIMIT) as number;

					itemRequest = mergeRequest(itemRequest, {
						qs: returnAll ? { index: 0, limit: RETURN_ALL_PAGE_SIZE } : { index: offset, limit },
					});
				}

				const responseData = await requestDeezer(this, itemRequest, returnAll);

				// Write endpoints (and a few others) answer with a bare boolean
				const json =
					typeof responseData === 'object' && responseData !== null
						? responseData
						: { success: responseData };

				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(json),
					{ itemData: { item: i } },
				);

				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					const executionData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray({ error: error.message }),
						{ itemData: { item: i } },
					);
					returnData.push(...executionData);
					continue;
				}

				// Keep the clear message of errors we already built (Deezer errors, missing auth)
				throw error instanceof NodeApiError || error instanceof NodeOperationError
					? error
					: new NodeApiError(this.getNode(), error as JsonObject, { itemIndex: i });
			}
		}

		return [returnData];
	}
}
