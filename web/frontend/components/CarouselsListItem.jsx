import { Badge, Heading, Link, Spinner, Tooltip } from "@shopify/polaris"
import React, { useState } from "react"
import { abbreviateNumber } from "../utils/abbreviateNumber.js"
import { CarouselsListPopover } from "./CarouselPopover.jsx"

const priorityIcon = <svg viewBox="0 0 24 24"><path fill="#56546F" d="M15 5h6c.55 0 1 .45 1 1s-.45 1-1 1h-6c-.55 0-1-.45-1-1s.45-1 1-1zm0 5.5h6c.55 0 1 .45 1 1s-.45 1-1 1h-6c-.55 0-1-.45-1-1s.45-1 1-1zm0 5.5h6c.55 0 1 .45 1 1s-.45 1-1 1h-6c-.55 0-1-.45-1-1s.45-1 1-1zm-5.15 3.15l1.79-1.79c.2-.2.2-.51 0-.71l-1.79-1.79a.495.495 0 0 0-.85.35v3.59c0 .44.54.66.85.35zM9 16h-.3c-2.35 0-4.45-1.71-4.68-4.05A4.509 4.509 0 0 1 8.5 7H11c.55 0 1-.45 1-1s-.45-1-1-1H8.5c-3.86 0-6.96 3.4-6.44 7.36C2.48 15.64 5.43 18 8.73 18H9"/></svg>
const viewsIcon = <svg viewBox="0 0 24 24"><path fill="#56546F" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5s5 2.24 5 5s-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3s3-1.34 3-3s-1.34-3-3-3z"/></svg>
const addedToCartIcon = <svg viewBox="0 0 24 24"><g fill="none" stroke="#56546F" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><circle cx="6" cy="19" r="2"/><circle cx="17" cy="19" r="2"/><path d="M17 17H6V3H4"/><path d="m6 5l6.005.429m7.138 6.573L19 13H6m9-7h6m-3-3v6"/></g></svg>
const conversionsIcon = <svg viewBox="0 0 640 512"><path fill="#56546F" d="m433.46 165.94l101.2-111.87C554.61 34.12 540.48 0 512.26 0H31.74C3.52 0-10.61 34.12 9.34 54.07L192 256v155.92c0 12.59 5.93 24.44 16 32l79.99 60c20.86 15.64 48.47 6.97 59.22-13.57C310.8 455.38 288 406.35 288 352c0-89.79 62.05-165.17 145.46-186.06zM480 192c-88.37 0-160 71.63-160 160s71.63 160 160 160s160-71.63 160-160s-71.63-160-160-160zm16 239.88V448c0 4.42-3.58 8-8 8h-16c-4.42 0-8-3.58-8-8v-16.29c-11.29-.58-22.27-4.52-31.37-11.35c-3.9-2.93-4.1-8.77-.57-12.14l11.75-11.21c2.77-2.64 6.89-2.76 10.13-.73c3.87 2.42 8.26 3.72 12.82 3.72h28.11c6.5 0 11.8-5.92 11.8-13.19c0-5.95-3.61-11.19-8.77-12.73l-45-13.5c-18.59-5.58-31.58-23.42-31.58-43.39c0-24.52 19.05-44.44 42.67-45.07V256c0-4.42 3.58-8 8-8h16c4.42 0 8 3.58 8 8v16.29c11.29.58 22.27 4.51 31.37 11.35c3.9 2.93 4.1 8.77.57 12.14l-11.75 11.21c-2.77 2.64-6.89 2.76-10.13.73c-3.87-2.43-8.26-3.72-12.82-3.72h-28.11c-6.5 0-11.8 5.92-11.8 13.19c0 5.95 3.61 11.19 8.77 12.73l45 13.5c18.59 5.58 31.58 23.42 31.58 43.39c0 24.53-19.04 44.44-42.67 45.07z"/></svg>
const revenueIcon = <svg viewBox="0 0 18 18"><path fill="#56546F" d="M6 5.5a1.5 1.5 0 1 1 3 0a1.5 1.5 0 0 1-3 0Z"/><path fill="#56546F" fillRule="evenodd" d="M1.5 0A1.5 1.5 0 0 0 0 1.5v8A1.5 1.5 0 0 0 1.5 11h12A1.5 1.5 0 0 0 15 9.5v-8A1.5 1.5 0 0 0 13.5 0h-12ZM4 2H2v2h1V3h1V2Zm3.5 1a2.5 2.5 0 1 0 0 5a2.5 2.5 0 0 0 0-5ZM12 3h-1V2h2v2h-1V3ZM3 7H2v2h2V8H3V7Zm8 2V8h1V7h1v2h-2Z" clipRule="evenodd"/><path fill="#56546F" d="M0 12v1h15v-1H0Zm0 2v1h15v-1H0Z"/></svg>

export const CarouselsListItem = ({ upsell, index, setUpsells, currency }) => {
	const [loadingStatusToggle, setLoadingStatusToggle] = useState(false)
	const [loadingDelete, setLoadingDelete] = useState(false)

	const views = upsell.stats?.views || 0
	const addedToCart = upsell.stats?.addedToCart || 0
	const conversions = upsell.stats?.conversions || 0
	const revenue = upsell.stats?.revenue || 0

	return (
		<div className="neu-background neu-shadow neu-border-radius-1" style={{ width: "100%", display: "flex", alignItems: "center", padding: "1rem" }}>
			<div style={{ width: "35%" }}>
				<h1 className="neu-text neu-text-600 font-satoshi" style={{ fontSize: "1rem" }}>{upsell.name}</h1>
			</div>

			<div style={{ width: "10%" }}>
				{
					loadingStatusToggle ?
						<Spinner size="small" />
					:
						<Badge status={upsell.published ? "success" : "critical"}>
							{upsell.published ? "Active" : "Inactive"}
						</Badge>
				}
			</div>

			<div style={{ width: "10%" }}>
				<Tooltip content="Priority">
					<div style={{ display: "flex", gap: "0.3rem" }}>
						<div style={{ width: "1.4rem", height: "1.4rem" }}>{priorityIcon}</div>
						<span className="font-satoshi neu-text neu-text-600">{Number(upsell.priority)}</span>
					</div>
				</Tooltip>
			</div>

			<div style={{ width: "15%", display: "flex", gap: "0.4rem", flexDirection: "column" }}>
				<div>
					<Tooltip content={`Impressions: ${Number(views).toLocaleString()}`}>
						<div style={{ display: "flex", gap: "0.3rem" }}>
							<div style={{ width: "1.4rem", height: "1.4rem" }}>{viewsIcon}</div>
							<span className="font-satoshi neu-text neu-text-600">{abbreviateNumber(Number(views))}</span>
						</div>
					</Tooltip>
				</div>
				<div>
					<Tooltip content={`Added to Cart: ${Number(addedToCart).toLocaleString()}`}>
						<div style={{ display: "flex", gap: "0.3rem" }}>
							<div style={{ width: "1.4rem", height: "1.2rem" }}>{addedToCartIcon}</div>
							<span className="font-satoshi neu-text neu-text-600">{abbreviateNumber(Number(addedToCart))}</span>
						</div>
					</Tooltip>
				</div>
			</div>

			<div style={{ width: "15%", display: "flex", gap: "0.4rem", flexDirection: "column" }}>
				<div>
					<Tooltip content={`Conversions: ${Number(conversions).toLocaleString()}`}>
						<div style={{ display: "flex", gap: "0.3rem" }}>
							<div style={{ width: "1.2rem", height: "1rem" }}>{conversionsIcon}</div>
							<span className="font-satoshi neu-text neu-text-600">{abbreviateNumber(Number(conversions))}</span>
						</div>
					</Tooltip>
				</div>
				<div>
					<Tooltip content={`Revenue: ${currency || ""} ${Number(revenue).toLocaleString()}`}>
						<div style={{ display: "flex", gap: "0.3rem" }}>
							<div style={{ width: "1.2rem", height: "1rem" }}>{revenueIcon}</div>
							<span className="font-satoshi neu-text neu-text-600">{currency || ""} {abbreviateNumber(Number(revenue))}</span>
						</div>
					</Tooltip>
				</div>
			</div>

			<div style={{ width: "15%", display: "flex", gap: "0.5rem" }}>
				<div>
					<Link url={`/carousels/${upsell.id}`} monochrome removeUnderline>
						<button className="neu-background neu-shadow neu-border-radius-2 neu-no-border" style={{ padding: "0.5rem 1rem", cursor: "pointer" }}>
							<span className="font-satoshi neu-text neu-text-600">Edit</span>
						</button>
					</Link>
				</div>
				<div>
					{
						loadingDelete ?
							<div className="neu-background neu-shadow neu-border-radius-2" style={{ padding: "0.3rem 0.6rem" }}>
								<Spinner size="small"/>
							</div>
						:
							<CarouselsListPopover
								upsell={upsell}
								setUpsells={setUpsells}
								setLoadingStatusToggle={setLoadingStatusToggle}
								setLoadingDelete={setLoadingDelete}
							/>
					}
				</div>
			</div>
		</div>
	)
}
