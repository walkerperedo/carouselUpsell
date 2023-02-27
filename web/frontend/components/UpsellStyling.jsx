import { Banner, Icon, Popover, Select } from "@shopify/polaris"
import React, { useState } from "react"
import { ChromePicker } from "react-color"
import { useUpdateUpsell } from "../hooks/upsellHooks.js"
import CustomCssEditor from "./CustomCssEditor.jsx"
import CustomModal from "./CustomModal.jsx"
import { UndoMajor } from "@shopify/polaris-icons"
import { useParams } from "react-router-dom"

export const UpsellStyling = ({ upsell, setUpsell }) => {
	const { id } = useParams()
	const [showCheckboxColorPicker, setShowCheckboxColorPicker] = useState(false)
	const [showCheckmarkColorPicker, setShowCheckmarkColorPicker] = useState(false)
	const [customCssModalOpen, setCustomCssModalOpen] = useState(false)
	const [resetCustomCssPopoverOpen, setResetCustomCssPopoverOpen] = useState(false)
	const updateUpsell = useUpdateUpsell()

	const onCheckboxTypeChange = (change) => {
		if (["switchOutline", "switchFill", "switchSlim"].includes(change)) {
			setUpsell({
				styling: {
					...upsell.styling,
					checkboxType: change,
					borderType: "",
					checkmarkType: "",
					checkmarkIcon: "default"
				}
			})
		}

		if (change === "box") {
			setUpsell({
				styling: {
					...upsell.styling,
					checkboxType: change,
					borderType: "squared",
					checkmarkType: "default",
					checkmarkIcon: "default"
				}
			})
		}
	}
	
	const onColorTypeChange = (change) => {
		if (change === "preset") {
			setUpsell({
				styling: {
					...upsell.styling,
					colorType: "preset",
					presetColor: "primary",
					customCheckboxColor: "",
					customCheckmarkColor: ""
				}
			})
		}

		if (change === "custom") {
			setUpsell({
				styling: {
					...upsell.styling,
					colorType: "custom",
					presetColor: "",
					customCheckboxColor: "#000",
					customCheckmarkColor: "#fff"
				}
			})
		}
	}

	const saveCustomCss = (upsellId, css) => {
		setUpsell({ styling: { ...upsell.styling, customCss: css } })
		updateUpsell(upsellId, { ...upsell, styling: { ...upsell.styling, customCss: css } })
		setCustomCssModalOpen(false)
	}

	const resetCustomCss = () => {
		setUpsell({ styling: { ...upsell.styling, customCss: null } })
		updateUpsell(id, { ...upsell, styling: { ...upsell.styling, customCss: null } })
		setResetCustomCssPopoverOpen(false)
	}

	const openCrispChatCustomCss = () => {
		if (window.$crisp) {
			window.$crisp.push(["do", "chat:open"])
			window.$crisp.push(["set", "message:text", ["Hey I need some help with the Custom CSS for my upsell."]])
			window.$crisp.push(["set", "session:data", [[
				["upsellId", id]
			]]])
		}
	}

	return (
		<div style={{ padding: "2rem 0rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
			<div style={{ display: "flex", gap: "1rem" }}>
				<div style={{ flex: "1" }}>
					<div className="font-satoshi neu-text neu-text-600" style={{ fontSize: "1rem", marginBottom: "0.7rem" }}>Checkbox Type</div>
					<Select
						options={[
							{ label: "Box", value: "box" },
							{ label: "Outlined Switch", value: "switchOutline" },
							{ label: "Filled Switch", value: "switchFill" },
							{ label: "Slim Switch", value: "switchSlim" },
						]}
						value={upsell.styling.checkboxType}
						onChange={(change) => onCheckboxTypeChange(change)}
					/>
				</div>
			</div>

			<div style={{ display: "flex", gap: "1rem" }}>
				<div style={{ flex: "1" }}>
					<div className="font-satoshi neu-text neu-text-600" style={{ fontSize: "1rem", marginBottom: "0.7rem" }}>Checkmark Icon</div>
					<Select
						options={[
							{ label: "Default", value: "default" },
							{ label: "Check Icon", value: "check" },
							{ label: "Check Thick Icon", value: "check-bold" },
							{ label: "Check Outline Icon", value: "check-outline" },
							{ label: "Close Icon", value: "close" },
							{ label: "Close Thick Icon", value: "close-thick" },
							{ label: "Close Outline Icon", value: "close-outline" },
						]}
						value={upsell.styling.checkmarkIcon}
						disabled={upsell.styling.checkboxType !== "box"}
						onChange={(change) => setUpsell({ styling: { ...upsell.styling, checkmarkIcon: change } })}
					/>
				</div>
			</div>

			<div style={{ display: "flex", gap: "1rem" }}>
				<div style={{ flex: "1" }}>
					<div className="font-satoshi neu-text neu-text-600" style={{ fontSize: "1rem", marginBottom: "0.7rem" }}>Border Type</div>
					<Select
						options={[
							{ label: "Squared", value: "squared" },
							{ label: "Curved", value: "curved" },
							{ label: "Round", value: "round" }
						]}
						value={upsell.styling.borderType}
						disabled={upsell.styling.checkboxType !== "box"}
						onChange={(change) => setUpsell({ styling: { ...upsell.styling, borderType: change } })}
					/>
				</div>
				<div style={{ flex: "1" }}>
					<div className="font-satoshi neu-text neu-text-600" style={{ fontSize: "1rem", marginBottom: "0.7rem" }}>Checkmark Type</div>
					<Select
						options={[
							{ label: "Default", value: "default" },
							{ label: "Fill", value: "fill" },
							{ label: "Thick", value: "thick" },
						]}
						value={upsell.styling.checkmarkType}
						disabled={upsell.styling.checkboxType !== "box" || upsell.styling.checkmarkIcon !== "default"}
						onChange={(change) => setUpsell({ styling: { ...upsell.styling, checkmarkType: change } })}
					/>
				</div>
			</div>

			<div style={{ display: "flex", gap: "1rem" }}>
				<div style={{ flex: "1" }}>
					<div className="font-satoshi neu-text neu-text-600" style={{ fontSize: "1rem", marginBottom: "0.7rem" }}>Color Type</div>
					<Select
						options={[
							{ label: "Preset", value: "preset" },
							{ label: "Custom Color", value: "custom" },
						]}
						value={upsell.styling.colorType}
						onChange={(change) => onColorTypeChange(change)}
					/>
				</div>
				
				<div style={{ flex: "1" }}>
					<div className="font-satoshi neu-text neu-text-600" style={{ fontSize: "1rem", marginBottom: "0.7rem" }}>Color</div>

					{
						upsell.styling.colorType === "preset" ?
							<Select
								options={[
									{ label: "Blue", value: "primary" },
									{ label: "Green", value: "success" },
									{ label: "Red", value: "danger" },
									{ label: "Yellow", value: "warning" },
									{ label: "Light Blue", value: "info" }
								]}
								value={upsell.styling.presetColor}
								onChange={(change) => setUpsell({ styling: { ...upsell.styling, presetColor: change } })}
							/>
						:
							<div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
								<button className="neu-background neu-shadow neu-border-radius-2 neu-no-border neu-button" style={{ padding: "0.5rem 1rem", cursor: "pointer", textAlign: "center" }} onClick={() => setShowCheckboxColorPicker(true)}>
									<span className="font-satoshi neu-text-600 neu-text">Pick Checkbox Color</span>
								</button>
								<Popover active={showCheckboxColorPicker} activator={<div></div>} fullHeight onClose={() => setShowCheckboxColorPicker(false)}>
									<div>
										<ChromePicker
											styles={{ boxShadow: "none" }}
											width="100%"
											disableAlpha
											color={upsell.styling.customCheckboxColor}
											onChange={change => setUpsell({ styling: { ...upsell.styling, customCheckboxColor: change.hex } })}
										/>
										{/* <div className="neu-background neu-shadow neu-border-radius-1 neu-button" style={{ margin: "0.6rem", padding: "0.5rem 1rem", cursor: "pointer", textAlign: "center" }} onClick={() => setShowCheckboxColorPicker(false)}>
											<span className="font-satoshi neu-text neu-text-600">Save</span>
										</div> */}
									</div>
								</Popover>

								<button className="neu-background neu-shadow neu-border-radius-2 neu-no-border neu-button" style={{ padding: "0.5rem 1rem", cursor: "pointer", textAlign: "center" }} onClick={() => setShowCheckmarkColorPicker(true)}>
									<span className="font-satoshi neu-text-600 neu-text">Pick Checkmark Color</span>
								</button>
								<Popover active={showCheckmarkColorPicker} activator={<div></div>} fullHeight onClose={() => setShowCheckmarkColorPicker(false)}>
									<div>
										<ChromePicker
											styles={{ boxShadow: "none" }}
											width="100%"
											disableAlpha
											color={upsell.styling.customCheckmarkColor}
											onChange={change => setUpsell({ styling: { ...upsell.styling, customCheckmarkColor: change.hex } })}
										/>
										{/* <div className="neu-background neu-shadow neu-border-radius-1 neu-button" style={{ margin: "0.6rem", padding: "0.5rem 1rem", cursor: "pointer", textAlign: "center" }} onClick={() => setShowCheckmarkColorPicker(false)}>
											<span className="font-satoshi neu-text neu-text-600">Save</span>
										</div> */}
									</div>
								</Popover>
							</div>
					}
				</div>
			</div>

			<div style={{ display: "flex", gap: "1rem" }}>
				<div style={{ flex: "1" }}>
					<div className="font-satoshi neu-text neu-text-600" style={{ fontSize: "1rem", marginBottom: "0.7rem" }}>Custom CSS</div>
					<div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
						<button
							className="neu-background neu-shadow neu-border-radius-2 neu-button neu-no-border"
							style={{ flex: "1" }}
							onClick={() => {
								setCustomCssModalOpen(true)
								setResetCustomCssPopoverOpen(false)
							}}
						>
							<span className="font-satoshi neu-text neu-text-600">Edit Custom CSS</span>
						</button>
						<Popover active={resetCustomCssPopoverOpen} activator={
							<button
								className="neu-background neu-shadow neu-border-radius-2 neu-button neu-no-border"
								style={{ padding: "0.6rem 0.4rem" }}
								onClick={() => setResetCustomCssPopoverOpen(!resetCustomCssPopoverOpen)}
							>
								<div style={{ height: "0.8rem" }}><Icon source={UndoMajor}/></div>
							</button>
						}>
							<div style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
								<Banner status="warning">
									Do you wish to reset the Custom CSS styles for this Upsell?
								</Banner>
								<button
									className="neu-background neu-shadow neu-border-radius-2 neu-button neu-no-border"
									onClick={resetCustomCss}
								>
									<span className="font-satoshi neu-text neu-text-600">Reset Custom CSS</span>
								</button>
							</div>
						</Popover>
					</div>
					<div style={{ marginTop: "1rem" }}>
						<Banner status="info">
							<span>Need Help? <a style={{ textDecoration: "underline", cursor: "pointer" }} onClick={openCrispChatCustomCss}>Let us help you customize your Upsell!</a></span>
						</Banner>
					</div>
				</div>
			</div>

			<CustomModal open={customCssModalOpen} onClose={() => setCustomCssModalOpen(false)} parentElementId="custom-css">
				<CustomCssEditor onSave={saveCustomCss} upsell={upsell} setUpsell={setUpsell}/>
			</CustomModal>
		</div>
	)
}
