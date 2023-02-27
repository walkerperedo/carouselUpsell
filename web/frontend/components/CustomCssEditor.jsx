import React, { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { defaultCustomCss } from "../utils/defaultCustomCss.js"

const CustomCssEditor = ({ onSave, upsell, setUpsell }) => {
	const { id } = useParams()
	const [editorContent, setEditorContent] = useState("")
	const [hasMadeChanges, setHasMadeChanges] = useState(false)
	const editorRef = useRef()

	const onChange = (change) => {
		setEditorContent(change.target.value)
		setHasMadeChanges(true)
	}

	const onKeyDown = (e) => {
		if (e.key == "Tab") {
			e.preventDefault()
			const { selectionStart, selectionEnd } = e.target
	
			const newText = editorContent.substring(0, selectionStart) + "    " + editorContent.substring(selectionEnd, editorContent.length)
	
			editorRef.current.focus()
			editorRef.current.value = newText
	
			editorRef.current.setSelectionRange(
				selectionStart + 2,
				selectionStart + 2
			)
	
			setEditorContent(newText)
		}
	}

	useEffect(() => {
		if (upsell.styling.customCss) {
			setEditorContent(upsell.styling.customCss)
		} else {
			setEditorContent(defaultCustomCss(id))
		}
	}, [])

	if (!id) {
		return (
			<div className="neu-background neu-border-radius-1 neu-shadow" style={{ padding: "2rem", width: "fit-content", margin: "auto" }}>
				<span style={{ marginTop: "0.5rem" }}>{!id ? "To edit the Custom CSS you need to save your Upsell first." : ""}</span>
			</div>
		)
	}

	return (
		<div className="neu-background neu-border-radius-1 neu-shadow" style={{ padding: "2rem", width: "700px", margin: "auto" }}>
			<h1 className="font-satoshi neu-text" style={{ marginBottom: "1rem", fontSize: "1.2rem" }}>
				Custom CSS
				{
					!upsell.styling.customCss && !hasMadeChanges ?
						<span style={{ fontSize: "0.7rem", opacity: "0.7", marginLeft: "0.5rem" }}>No Changes Made</span>
					: hasMadeChanges ?
						<span style={{ fontSize: "0.7rem", opacity: "0.7", marginLeft: "0.5rem" }}>Unsaved Changes</span>
					: ""
				}
			</h1>
			<textarea
				rows="20"
				cols="60"
				onChange={onChange}
				value={editorContent}
				ref={editorRef}
				onKeyDown={onKeyDown}
				className="neu-background neu-shadow neu-border-radius-1"
				style={{ width: "100%", border: "none", padding: "1rem", resize: "vertical", whiteSpace: "nowrap" }}
			/>

			<button
				className="neu-background neu-shadow neu-border-radius-2 neu-button neu-no-border"
				style={{ marginTop: "1rem", width: "100%" }}
				disabled={!hasMadeChanges}
				onClick={() => onSave(id, editorContent)}
			>
				<span className="font-satoshi neu-text neu-text-600">Save Changes</span>
			</button>
		</div>
	)
}

export default CustomCssEditor