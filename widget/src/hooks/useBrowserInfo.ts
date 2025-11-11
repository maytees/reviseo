interface BrowserInfo {
	browser: string;
	browserVersion: string;
	cpu: string;
	os: string;
	device: string;
	engine: string;
}

import * as React from "react";
import * as UAParser from "ua-parser-js";

function useUserAgent(uastring = window.navigator.userAgent) {
	const [state, setState] = React.useState<BrowserInfo | null>(null);

	React.useEffect(() => {
		let didRun = true;
		try {
			const uaParser = new UAParser.UAParser();
			uaParser.setUA(uastring);
			const payload: BrowserInfo = {
				os: uaParser.getOS().name,
				browser: uaParser.getBrowser().name,
				browserVersion: uaParser.getBrowser().version,
				cpu: uaParser.getCPU().architecture,
				device: uaParser.getDevice().type,
				engine: uaParser.getEngine().name,
			};
			if (didRun) {
				setState(payload);
			}
		} catch (err) {
			if (didRun) {
				setState(null);
			}

			console.error(err);
		}
		return () => {
			didRun = false;
		};
	}, [uastring]); // <-- Add this empty dependency array

	return state;
}

export { useUserAgent };
