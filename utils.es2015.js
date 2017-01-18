//fetch
const fetch = window.fetch || (() => {
	let id = 0;
	const body = document.body;
	const serialize = obj => Object.keys(obj).reduce((result, curr) => {
		result.push(`${curr}=${obj[curr]}`);
		return result;
	}, []).join("&");
	const format = data => ({
		text: () => Promise.resolve(JSON.stringify(data)),
		json: () => Promise.resolve(JSON.parse(JSON.stringify(data)))
	});
	return (url, {
		type = "get",
		data = {},
		dataType = "json",
		async = 1,
		jsonp,
		headers = [
			,
			{
				"Content-Type": "application/x-www-form-urlencoded"
			}
		][+(type === "post")]
	}) => {
		id++;
		return new Promise((resolve, reject) => {
			if(jsonp){
				const script = document.createElement("script");
				data = serialize(data);
				script.src = `${url}?type=jsonp&id=${id}${[`&${data}`, ""][+!data.length]}`;
				window[["jsonpCallback_", id].join("")] = data => {
					resolve(format(data));
				};
				return body.appendChild(script);
			}
			const xhr = new XMLHttpRequest;
			xhr.onreadystatechange = () => {
				if(xhr.readyState === 4){
					if(xhr.status >= 200 && xhr.status < 300){
						resolve(format(xhr.responseText));
					}else{
						reject(xhr.responseText);
					}
				}
			};
			xhr.open(type, `${url}${["", `?${serialize(data)}`][+(type === "get")]}`, async);
			for(let a in headers){
				xhr.setRequestHeader(a, headers[a]);
			}
			xhr.send([serialize(data), null][+(type === "get")]);
		});
	};
})();