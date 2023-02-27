import { ActionList, Icon, Popover, Toast } from "@shopify/polaris"
import { MobileHorizontalDotsMajor } from "@shopify/polaris-icons"
import React, { useCallback, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDeleteUpsell, useUpdateUpsell } from "../hooks/upsellHooks.js"

export const UpsellsListPopover = ({ upsell, setUpsells, setLoadingStatusToggle, setLoadingDelete }) => {
	const deleteUpsellById = useDeleteUpsell()
	const updateUpsellById = useUpdateUpsell()

	const navigate = useNavigate()

	const [popoverOpen, setPopoverOpen] = useState(false)
	const [toastOpen, setToastOpen] = useState(false)
	const [toastErrorMessage, setToastErrorMessage] = useState("")

	const deleteUpsell = async () => {
		try {
			setPopoverOpen(false)
			setLoadingDelete(true)

			await deleteUpsellById(upsell.id)

			setUpsells((upsells) => {
				return upsells.filter((u) => u.id != upsell.id)
			})
		} catch (error) {
			setToastOpen(true)
			setToastErrorMessage("Error deleting Upsell")
		} finally {
			setLoadingDelete(false)
		}
	}

	const toggleUpsellStatus = async () => {
		try {
			setPopoverOpen(false)
			setLoadingStatusToggle(true)

			await updateUpsellById(upsell.id, { ...upsell, published: !upsell.published })

			setUpsells((upsells) => {
				return upsells.map((u) => {
					if (u.id == upsell.id) {
						u.published = !u.published
					}
					return u
				})
			})

		} catch (error) {
			setToastOpen(true)
			setToastErrorMessage("Error updating Upsell")
		} finally {
			setLoadingStatusToggle(false)
		}
	}

	return (
		<>
			<Popover
				active={popoverOpen}
				activator={
					<button className="neu-background neu-shadow neu-border-radius-2 neu-no-border" style={{ padding: "0.5rem 0.5rem", cursor: "pointer" }} onClick={() => setPopoverOpen(!popoverOpen)}>
						<Icon source={MobileHorizontalDotsMajor} color="base" />
					</button>
				}
				onClose={() => setPopoverOpen(false)}
				preferredPosition="below"
			>
				<ActionList
					actionRole="menuitem"
					items={[
						{
							content: upsell.published ? "Unpublish" : "Publish",
							onAction: toggleUpsellStatus
						},
						{
							content: "Delete",
							onAction: deleteUpsell,
							destructive: true
						},
					]}
				/>
			</Popover>

			{ toastOpen && <Toast content={toastErrorMessage} onDismiss={() => setToastOpen(false)} error/> }
		</>
	)
}
