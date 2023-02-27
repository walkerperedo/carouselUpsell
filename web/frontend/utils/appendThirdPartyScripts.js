export const appendThirdPartyScripts = (shop) => {
	// Crisp Chat scripts
	const crispChatScript = document.createElement("script")
	crispChatScript.innerHTML = "window.$crisp=[];window.CRISP_WEBSITE_ID=\"516fd653-2e43-48e3-8f33-0e7b80944e11\";(function(){d=document;s=d.createElement(\"script\");s.src=\"https://client.crisp.chat/l.js\";s.async=1;d.getElementsByTagName(\"head\")[0].appendChild(s);})();"
	crispChatScript.async = true
	document.body.appendChild(crispChatScript)
	
	if (shop) {
		const crispChatIdentifyScript = document.createElement("script")
		crispChatIdentifyScript.innerHTML = `$crisp.push(["set", "user:nickname", ["${shop}"]]);`
		crispChatIdentifyScript.async = true
		document.body.appendChild(crispChatIdentifyScript)
	}
}