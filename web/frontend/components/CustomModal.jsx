import { Icon } from "@shopify/polaris"
import { CancelSmallMinor } from "@shopify/polaris-icons"
import React from "react"

const CustomModal = (props) => {
	const { open, onClose, parentElementId } = props

	const closeModal = (e, force = false) => {
		if (force || e.target.id === parentElementId) {
			onClose()
		}
	}

	if (!open) return ""

	return (
		<div
			id={parentElementId}
			style={{
				position: "fixed",
				width: "100vw",
				height: "100vh",
				top: "0px",
				left: "0px",
				zIndex: "9000",
				background: "rgba(0, 0, 0, 0.3)",
				backdropFilter: "blur(8px)",
				padding: "1rem 2rem 1rem 1rem",
				transform: "translate3d(0px, 0px, 0px)"
			}}
			onClick={(e) => closeModal(e)}
		>
			<div
				id={`${parentElementId}-close`}
				className="neu-background neu-shadow"
				style={{
					position: "absolute",
					top: "15px",
					right: "35px",
					padding: "10px",
					borderRadius: "100%",
					cursor: "pointer"
				}}
				onClick={(e) => closeModal(e, true)}
			>
				<Icon source={CancelSmallMinor}/>
			</div>

			{ props.children }
		</div>
	)
}

export default CustomModal