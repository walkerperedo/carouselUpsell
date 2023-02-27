import { Heading, Tooltip } from "@shopify/polaris"
import React from "react"
import { abbreviateNumber } from "../utils/abbreviateNumber.js"

// From https://icones.netlify.app
const icons = {
	impressions: <svg viewBox="0 0 24 24"><path fill="#56546F" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5s5 2.24 5 5s-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3s3-1.34 3-3s-1.34-3-3-3z"/></svg>,
	addToCart: <svg viewBox="0 0 24 24"><g fill="none" stroke="#56546F" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><circle cx="6" cy="19" r="2"/><circle cx="17" cy="19" r="2"/><path d="M17 17H6V3H4"/><path d="m6 5l6.005.429m7.138 6.573L19 13H6m9-7h6m-3-3v6"/></g></svg>,
	conversions: <svg viewBox="0 0 640 512"><path fill="#56546F" d="m433.46 165.94l101.2-111.87C554.61 34.12 540.48 0 512.26 0H31.74C3.52 0-10.61 34.12 9.34 54.07L192 256v155.92c0 12.59 5.93 24.44 16 32l79.99 60c20.86 15.64 48.47 6.97 59.22-13.57C310.8 455.38 288 406.35 288 352c0-89.79 62.05-165.17 145.46-186.06zM480 192c-88.37 0-160 71.63-160 160s71.63 160 160 160s160-71.63 160-160s-71.63-160-160-160zm16 239.88V448c0 4.42-3.58 8-8 8h-16c-4.42 0-8-3.58-8-8v-16.29c-11.29-.58-22.27-4.52-31.37-11.35c-3.9-2.93-4.1-8.77-.57-12.14l11.75-11.21c2.77-2.64 6.89-2.76 10.13-.73c3.87 2.42 8.26 3.72 12.82 3.72h28.11c6.5 0 11.8-5.92 11.8-13.19c0-5.95-3.61-11.19-8.77-12.73l-45-13.5c-18.59-5.58-31.58-23.42-31.58-43.39c0-24.52 19.05-44.44 42.67-45.07V256c0-4.42 3.58-8 8-8h16c4.42 0 8 3.58 8 8v16.29c11.29.58 22.27 4.51 31.37 11.35c3.9 2.93 4.1 8.77.57 12.14l-11.75 11.21c-2.77 2.64-6.89 2.76-10.13.73c-3.87-2.43-8.26-3.72-12.82-3.72h-28.11c-6.5 0-11.8 5.92-11.8 13.19c0 5.95 3.61 11.19 8.77 12.73l45 13.5c18.59 5.58 31.58 23.42 31.58 43.39c0 24.53-19.04 44.44-42.67 45.07z"/></svg>,
	totalRevenue: <svg viewBox="0 0 18 18"><path fill="#56546F" d="M6 5.5a1.5 1.5 0 1 1 3 0a1.5 1.5 0 0 1-3 0Z"/><path fill="#56546F" fillRule="evenodd" d="M1.5 0A1.5 1.5 0 0 0 0 1.5v8A1.5 1.5 0 0 0 1.5 11h12A1.5 1.5 0 0 0 15 9.5v-8A1.5 1.5 0 0 0 13.5 0h-12ZM4 2H2v2h1V3h1V2Zm3.5 1a2.5 2.5 0 1 0 0 5a2.5 2.5 0 0 0 0-5ZM12 3h-1V2h2v2h-1V3ZM3 7H2v2h2V8H3V7Zm8 2V8h1V7h1v2h-2Z" clipRule="evenodd"/><path fill="#56546F" d="M0 12v1h15v-1H0Zm0 2v1h15v-1H0Z"/></svg>
}

export const StatisticCard = ({ statName, title, data, currency }) => {
	return (
		<div className="neu-background neu-shadow neu-border-radius-1" style={{ padding: "1rem 1rem 1.5rem 1rem", height: "8rem", width: "25%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
			<div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
				<div style={{ width: "1.5rem", height: "1.5rem" }}>
					{ icons[statName] }
				</div>

				<div style={{ display: "flex", gap: "0.8rem", alignItems: "center", flex: "1" }}>
					<h1 className="neu-text neu-text-600 font-satoshi" style={{ fontSize: "1rem" }}>{title}</h1>
				</div>
			</div>

			<div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1.5rem" }}>
				<Tooltip content={`${currency || ""} ${Number(data.number).toLocaleString()}`}>
					<div className="font-satoshi neu-text neu-text-600" style={{ fontSize: "2.2rem" }}>
						<span style={{ fontSize: "1rem" }}>{currency || ""}</span> {abbreviateNumber(Number(data.number))}
					</div>
				</Tooltip>
			</div>
		</div>
	)
}
