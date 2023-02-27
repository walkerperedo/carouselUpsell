import { authenticatedFetch } from "@shopify/app-bridge-utils"
import { useAppBridge } from "@shopify/app-bridge-react"
import { Redirect } from "@shopify/app-bridge/actions"
import { useLocation } from "react-router-dom"
import { GlobalStateContext } from "../components/providers/GlobalStateProvider"
import { useContext } from "react"

/**
 * A hook that returns an auth-aware fetch function.
 * @desc The returned fetch function that matches the browser's fetch API
 * See: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
 * It will provide the following functionality:
 *
 * 1. Add a `X-Shopify-Access-Token` header to the request.
 * 2. Check response for `X-Shopify-API-Request-Failure-Reauthorize` header.
 * 3. Redirect the user to the reauthorization URL if the header is present.
 *
 * @returns {Function} fetch function
 */
export function useAuthenticatedFetch() {
	const app = useAppBridge()
	const fetchFunction = authenticatedFetch(app)
	const location = useLocation()
	const { state, dispatch } = useContext(GlobalStateContext)

	const shop = new URLSearchParams(location.search).get("shop") || state.shop

	return async (uri, options = {}) => {
		const reqUri = `${uri}${uri.indexOf("?") === -1 ? "?" : "&"}shop=${shop}`
		const response = await fetchFunction(reqUri, options)
		checkHeadersForReauthorization(response.headers, app)
		return response
	}
}

function checkHeadersForReauthorization(headers, app) {
	if (headers.get("X-Shopify-API-Request-Failure-Reauthorize") === "1") {
		const authUrlHeader = headers.get("X-Shopify-API-Request-Failure-Reauthorize-Url") || "/api/auth"

		const redirect = Redirect.create(app)
		redirect.dispatch(
			Redirect.Action.REMOTE,
			authUrlHeader.startsWith("/") ?
				`https://${window.location.host}${authUrlHeader}`
				: authUrlHeader
		)
	}
}
