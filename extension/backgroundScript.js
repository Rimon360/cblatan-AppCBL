(async () => {
    // const api = 'http://localhost:8000/vHU6wxhS396wxhS39wxhS39/api/users/';
    // const productApi = 'http://localhost:8000/vHU6wxhS396wxhS39wxhS39/api/products';
    const api = 'https://www.appcbl.lat/s/vHU6wxhS396wxhS39wxhS39/api/users/';
    const productApi = 'https://www.appcbl.lat/s/vHU6wxhS396wxhS39wxhS39/api/products';

    function randInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    async function get(key) {
        return (await chrome.storage.local.get(key))?.[key] || null;
    }

    async function set(key, v) {
        (await chrome.storage.local.set({ [key]: v }));
    }
    async function remove(key) {
        return (await chrome.storage.local.remove(key));
    }
    async function wait(s) {
        return await new Promise(rs => {
            setTimeout(() => {
                rs()
            }, s * 1000);
        })
    }

    async function setProxy(proxy) {
        // PAC script with embedded credentials (may not work in all cases)
        // let proxyArray = proxy.split("://") 
        const pacScript = `
    function FindProxyForURL(url, host) {
      // Try SOCKS5 with authentication embedded
      return "SOCKS5 127.0.0.1:1080; DIRECT";
    }
  `;

        const config = {
            mode: "pac_script",
            pacScript: {
                data: pacScript
            }
        };

        return new Promise(rs => {
            chrome.proxy.settings.set(
                { value: config, scope: "regular" },
                function () {
                    if (chrome.runtime.lastError) {
                        rs("Error:" + chrome.runtime.lastError)
                    } else {
                        rs(true)
                    }
                }
            );
        })

    }

    function setSystemProxy() {

        const config = {
            mode: "system"
        };

        chrome.proxy.settings.set(
            { value: config, scope: "regular" },
            function () {
                if (chrome.runtime.lastError) {
                    console.error("Error:", chrome.runtime.lastError);
                } else {
                    console.log("✓ Using system proxy settings");
                }
            }
        );
    }
    chrome.runtime.onInstalled.addListener(setSystemProxy);
    chrome.runtime.onStartup.addListener(setSystemProxy);

    chrome.runtime.onMessage.addListener((m, s, sr) => {
        if (m.ref == 'set_proxy') {
            (async () => {
                let { proxy } = m;
                let res = await setProxy(proxy);
                sr(res)
            })()

        } else if (m.ref == 'reset_proxy') {
            setSystemProxy()
            sr(true)
        }
        return true;
    })

    chrome.runtime.onInstalled.addListener(async e => {
        let url = chrome.runtime.getURL('index.html');
        await chrome.tabs.create({ url });
        let tabs = await chrome.tabs.query({ url: "chrome://newtab/" });
        for (const tab of tabs) {
            chrome.tabs.remove(tab.id);
        }

    })
    chrome.alarms.onAlarm.addListener(function (alarm) { });
    chrome.alarms.create("activateBackgroundAlarm", { periodInMinutes: .1 });

    chrome.action.onClicked.addListener(async (tab) => {
        await remove("token")
        let popupUrl = chrome.runtime.getURL('index.html');
        chrome.tabs.create({ url: popupUrl });
    })


    const windowTrackKey = "windowTrackList"
    chrome.windows.onRemoved.addListener(async (windowId) => {
        let token = await get('token');
        let trackedList = (await chrome.storage.local.get(windowTrackKey))[windowTrackKey] || [];
        let newList = []
        for (const list of trackedList) {

            if (list[windowId]) {
                await fetch(productApi + '/activitystatus/minus', { method: "POST", body: JSON.stringify({ id: list[windowId] }), headers: { "content-type": "application/json", Authorization: "Bearer: " + token } })
                continue
            }
            newList.push(list);

        }
        await chrome.storage.local.set({ [windowTrackKey]: newList });

    });


    let token = await get('token');
    await ping(token)
    async function ping(token) {
        token = await get('token');
        if (!token) {
            return;
        }
        try {
            fetch(api + 'ping', { method: "POST", headers: { Authorization: "Bearer " + token } }).then(req => {
                if (req.status === 401) {
                    remove('token');
                    chrome.tabs.query({ url: chrome.runtime.getURL('index.html') }, (tabs) => {
                        tabs.forEach(tab => chrome.tabs.reload(tab.id));
                    });

                }
            });
        } catch (error) {
            console.log(error);

        }
    }
    setInterval(async () => {
        token = await get('token');
        if (!token) {
            console.log("User Token not found. Please, try logging again!");
        }
        await ping(token)
    }, 15 * 1000);

})()