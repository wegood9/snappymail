
(win => {

const
	doc = document,
	eId = id => doc.getElementById(id),
	htmlCL = doc.documentElement.classList,
	app = eId('rl-app'),
	options = app && app.dataset.boot && JSON.parse(app.dataset.boot) || {},

	Storage = type => {
		let name = type+'Storage';
		try {
			win[name].setItem(name, '');
			win[name].getItem(name);
			win[name].removeItem(name);
		} catch (e) {
			console.error(e);
			const cookieName = encodeURIComponent(name+('session' === type ? win.name || (win.name = Date.now()) : ''));

			// initialise if there's already data
			let data = doc.cookie.match('(^|;) ?'+cookieName+'=([^;]*)(;|$)');
			data = data ? decodeURIComponent(data[2]) : null;
			data = data ? JSON.parse(data) : {};

			win[name] = {
				getItem: key => data[key] === undefined ? null : data[key],
				setItem: function (key, value) {
					data[key] = ''+value; // forces the value to a string
					doc.cookie = cookieName+'='+encodeURIComponent(JSON.stringify(data))
						+"; expires="+('local' === type ? (new Date(Date.now()+(365*24*60*60*1000))).toGMTString() : '')
						+"; path=/; samesite=strict";
				}
			};
		}
	},
	STORAGE_KEY = '__rlA',
	TIME_KEY = '__rlT',
	AUTH_KEY = 'AuthAccountHash',
	storage = () => window.sessionStorage,
	timestamp = () => Math.round(Date.now() / 1000),
	setTimestamp = () => storage().setItem(TIME_KEY, timestamp()),

	showError = () => {
		eId('rl-loading').hidden = true;
		eId('rl-loading-error').hidden = false;
		p.end();
	},

	loadScript = src => {
		if (!src) {
			throw new Error('src should not be empty.');
		}
		return new Promise((resolve, reject) => {
			const script = doc.createElement('script');
			script.onload = () => {
				p.set(pStep += step);
				resolve();
			};
			script.onerror = () => reject(new Error(src));
			script.src = src;
//			script.async = true;
			doc.head.append(script);
		});
	},

	step = 100 / 7,
	p = win.progressJs = {
		set: percent => progress.style.width = Math.min(percent, 100) + '%',
		end: () => {
			if (container) {
				p.set(100);
				setTimeout(() => {
					container.remove();
					container = progress = null;
				}, 600);
			}
		}
	};

if (!navigator || !navigator.cookieEnabled) {
	doc.location.href = './?/NoCookie';
}

let pStep = 0,
	container = doc.querySelector('.progressjs'),
	progress = doc.querySelector('.progressjs-inner'),

	RL_APP_DATA = {};

win.rl = {
	hash: {
		// getHash
		get: () => storage().getItem(STORAGE_KEY) || null,
		// setHash
		set: () => {
			storage().setItem(STORAGE_KEY, RL_APP_DATA && RL_APP_DATA[AUTH_KEY]
				? RL_APP_DATA[AUTH_KEY] : '');
			setTimestamp();
		},
		// clearHash
		clear: () => {
			storage().setItem(STORAGE_KEY, '');
			setTimestamp();
		},
		// checkTimestamp
		check: () => {
			if (timestamp() > (parseInt(storage().getItem(TIME_KEY) || 0, 10) || 0) + 3600000) {
				// 60m
				rl.hash.clear();
				return true;
			}
			return false;
		}
	},
	data: () => RL_APP_DATA,
	adminArea: () => options.admin,
	settings: {
		get: name => null == RL_APP_DATA[name] ? null : RL_APP_DATA[name],
		set: (name, value) => RL_APP_DATA[name] = value,
		app: name => {
			const APP_SETTINGS = RL_APP_DATA.System || {};
			return null == APP_SETTINGS[name] ? null : APP_SETTINGS[name];
		},
		capa: name => null != name && Array.isArray(RL_APP_DATA.Capa) && RL_APP_DATA.Capa.includes(name)
	},
	setWindowTitle: title => {
		title = null == title ? '' : '' + title;
		if (RL_APP_DATA.Title) {
			title += (title ? ' - ' : '') + RL_APP_DATA.Title;
		}
		doc.title = null == title ? '' : '' + title;
	},

	initData: appData => {
		RL_APP_DATA = appData;

		rl.hash.set();

		if (appData) {
			if (appData.NewThemeLink) {
				eId('app-theme-link').href = appData.NewThemeLink;
			}

			loadScript(appData.StaticLibJsLink)
			.then(() => Promise.all([loadScript(appData.TemplatesLink), loadScript(appData.LangLink)]))
			.then(() => loadScript(appData.StaticAppJsLink))
			.then(() => appData.PluginsLink ? loadScript(appData.PluginsLink) : Promise.resolve())
			.then(() =>
				// Enable the old CKEditor?
				(appData.Auth && appData.StaticEditorJsLink)
					? loadScript(appData.StaticEditorJsLink)
					: Promise.resolve()
			)
			.then(() => win.__APP_BOOT ? win.__APP_BOOT(showError) : showError())
			.catch(e => {
				showError();
				throw e;
			});
		} else {
			showError();
		}
	}
};

p.set(1);

Storage('local');
Storage('session');

// init section
setInterval(setTimestamp, 60000); // 1m

htmlCL.add(options.mobileDevice ? 'mobile' : 'no-mobile');

[eId('app-css'),eId('app-theme-link')].forEach(css => css.href = css.dataset.href);

loadScript('./?/'
	+ (options.admin ? 'Admin' : '')
	+ 'AppData@'
	+ (options.mobile ? 'mobile' : 'no-mobile')
	+ (options.mobileDevice ? '-1' : '-0')
	+ '/'
	+ (rl.hash.get() || '0')
	+ '/'
	+ Math.random().toString().substr(2)
	+ '/').then(() => {});

})(this);
