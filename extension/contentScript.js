_init_()
async function _init_() {
    let emailInputSelectors = 'input[type="email"], input[name="email"], input[name="login"],input[placeholder="Email"], input#username,form input[id="email"]'
    let passwordInputSelectors =
        'form input[type="password"],form input[name="password"],form input.password,form input#password,form input[aria-label="password"],input[type="password"], input[name="password"] '
    let emailInputs, passwordInputs

    function getElementsBySelectorAll(index = 1) {
        let forms = document.querySelectorAll("form")
        let tmp = []
        forms.forEach((form) => {
            let elements = form.querySelectorAll('input:not([type="hidden"]), input[type="email"], input[type="password"], input[name="email"], input[name="password"]')
            elements.forEach((input, i) => {
                let exclude = ["button", "submit", "search", "hidden"]
                if (
                    exclude.includes(input.getAttribute("type")) ||
                    exclude.includes(input.getAttribute("name")) ||
                    input.getAttribute("id")?.includes("search") ||
                    input.getAttribute("readonly") == true ||
                    exclude.includes(input.style.visibility) ||
                    input.getAttribute("type")?.includes("search")
                )
                    return
                if (i + 1 === index && input.clientHeight > 20 && input.clientWidth > 50) {
                    tmp.push(input)
                }
            })
        })
        if (tmp.length === 0) {
            tmp = document.querySelectorAll(emailInputSelectors)
            if (index === 2) {
                tmp = document.querySelectorAll(passwordInputSelectors)
            }
        }
        return Array.from(tmp).filter((e) => e.clientWidth > 50 && e.style.visibility !== "hidden" && e.getAttribute("readonly") != true)
    }
    disableInspect()
    function disableInspect() {
        console.log("Disabling inspect element...")
        const preventInspect = (e) => {
            e.preventDefault()
            return false
        }
        document.addEventListener("keydown", (e) => {
            if (e.key === "F12" || (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key)) || (e.ctrlKey && e.key === "U")) preventInspect(e)
        })

        document.addEventListener("contextmenu", preventInspect)
        setInterval(() => {
            if (window.outerHeight - window.innerHeight > 200) window.close() // likely devtools open
        }, 1000)
    }

    function insertValue(el, value) {
        if (currentDomain.includes('humbot')) {
            el = document.querySelector('input#email')
        }
        const nvs = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set
        nvs.call(el, el.value + value)
        const inputEvent = new Event("input", { bubbles: true })
        el.dispatchEvent(inputEvent)
        el.dispatchEvent(new Event("change", { bubbles: true }))
        el.dispatchEvent(new Event("blur", { bubbles: true }))
    }

    function randInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min
    }
    async function get(key) {
        return (await chrome.storage.local.get(key))?.[key] || null
    }
    async function set(key, v) {
        await chrome.storage.local.set({ [key]: v })
    }
    async function remove(key) {
        return await chrome.storage.local.remove(key)
    }
    async function wait(s) {
        return await new Promise((rs) => {
            setTimeout(() => {
                rs()
            }, s * 1000)
        })
    }

    function msg(v, c = "red") {
        console.log("%c..." + v + "...", "color:" + c)
    }

    function getFormButton() {
        let buttonSelectors = "form button"
        let buttons = document.querySelectorAll(buttonSelectors)
        let tmp = []
        buttons.forEach((button) => {
            if (button.clientHeight > 20 && button.clientWidth > 50) {
                tmp.push(button)
            }
        })
        return tmp
    }
    function initEvents(el, events, key = "A") {
        events.forEach((ev) => {
            if (["mousedown", "mouseup", "mousemove", "mouseenter", "mouseleave", "mouseout"].includes(ev)) {
                el.dispatchEvent(
                    new MouseEvent(ev, {
                        bubbles: true,
                        cancelable: true,
                        view: window,
                        clientX: randInt(111, 666),
                        clientY: randInt(111, 666),
                        button: 1,
                    })
                )
            } else if (["keydown", "keyup", "keypress"].includes(ev)) {
                el.dispatchEvent(
                    new KeyboardEvent(ev, {
                        key: key,
                        code: key.charCodeAt(0),
                        keyCode: key.charCodeAt(0),
                        bubbles: true,
                        cancelable: true,
                    })
                )
            } else if (["touchstart", "touchend"].includes(ev)) {
                let touch = new Touch({
                    identifier: Date.now(),
                    target: el,
                    clientX: randInt(111, 666),
                    clientY: randInt(111, 666),
                    radiusX: randInt(111, 666),
                    radiusY: randInt(111, 666),
                    force: randInt(0, 1),
                })

                let event = new TouchEvent(ev, {
                    touches: [touch],
                    targetTouches: [touch],
                    changedTouches: [touch],
                    bubbles: true,
                    cancelable: true,
                })

                el.dispatchEvent(event)
            } else {
                el.dispatchEvent(new Event(ev, { bubbles: true, cancelable: true }))
            }
        })
    }

    function mockForm() {
        const form = document.createElement("form")
        const emailInput = document.createElement("input")
        emailInput.type = "email"
        emailInput.id = "email11"
        const passInput = document.createElement("input")
        passInput.type = "password"
        passInput.id = "password22"
        form.appendChild(emailInput)
        form.appendChild(passInput)
        document.body.appendChild(form)
        let e = document.querySelector("#email11")
        e.value = "thisisaaemail@t.com"
        let p = document.querySelector("#password22")
        p.value = "PASSWORDs@k33314"
    }

    let productData = await get("product")
    if (!productData) return
    let email = productData.e
    let password = productData.k
    // password = await decrypt(password, keyValue.reverse().join(''))
    let time = Math.floor((Date.now() - productData.t) / 1000)
    if (time > 60) {
        await remove("product")
        alert("Iniciar sesión caducado, ¡intente iniciar sesión nuevamente!", "orange")
        return
    }
    if (!email || !password) {
        return msg("No pending product...")
    }
    let currentDomain = location.hostname
    let int1 = setInterval(async () => {
        emailInputs = getElementsBySelectorAll(1)

        if (emailInputs.length > 0) {
            clearInterval(int1)
            await wait(3)

            emailInputs = getElementsBySelectorAll(1)
            emailInputs.forEach(async (emailInput) => {
                let _form = emailInput.closest('form');
                if (_form) _form.reset();
                emailInput.setAttribute("autocomplete", "off")
                emailInput.style.opacity = "0"
                emailInput.style.visibility = "hidden"
                let p = document.createElement("p")
                p.innerText = "Email - Autofilled"
                emailInput.focus()
                await wait(0.05)
                insertValue(emailInput, '')
                emailInput.value = '';


                insertValue(emailInput, email)
                emailInput.parentElement.appendChild(p)
                emailInput.blur()
                if (!location.hostname.includes("coursera")) {
                    initEvents(emailInput, ["keydown", "keyup", "keypress", "input", "change", "click", "focus"])
                }
                autoFillPassword(emailInput)
            })
        }
    }, 500)
    if (location.hostname.includes('healthcare')) autoFillPassword()
    function autoFillPassword(emailInput = null) {
        let int2 = setInterval(async () => {
            passwordInputs = getElementsBySelectorAll(2)
            if (passwordInputs.length > 0) {
                clearInterval(int2)
                await wait(2)

                if (emailInput && (currentDomain.includes("coursera") || currentDomain.includes("crehana"))) {
                    let dummyEmailInput = document.createElement("input")
                    dummyEmailInput.type = "email"
                    dummyEmailInput.id = "passwordinputt"
                    emailInput.parentElement.appendChild(dummyEmailInput)
                    emailInput.parentElement.querySelector("#passwordinputt").value = "TEST@TEST.com"
                }

                passwordInputs.forEach(async (passwordInput) => {
                    if (currentDomain.includes("coursera") || currentDomain.includes("crehana")) {
                        let dummyInput = document.createElement("input")
                        dummyInput.type = "password"
                        dummyInput.id = "password-input"
                        passwordInput.parentElement.appendChild(dummyInput)
                        passwordInput.parentElement.querySelector("#password-input").value = "TESTTEST"
                    } else {
                        passwordInput.setAttribute("type", "hidden")
                    }

                    passwordInput.setAttribute("autocomplete", "off")
                    let p = document.createElement("p")
                    p.innerText = "Password - Autofilled"
                    passwordInput.focus()
                    initEvents(passwordInput, ["keydown", "keyup", "keypress", "input", "change", "click", "focus"])
                    passwordInput.style.display = "none"
                    passwordInput.value = ''
                    passwordInput.value = password
                    if (!location.hostname.includes("coursera")) {
                        passwordInput.setAttribute("type", "password")
                        initEvents(passwordInput, ["keydown", "keyup", "keypress", "input", "change", "click", "focus"])
                        console.log(".....event initated......")
                    }

                    passwordInput.style.opacity = "0"
                    passwordInput.blur()
                    if (emailInput) { emailInput.style.visibility = "hidden" }
                    passwordInput.parentElement.appendChild(p)

                    if (!currentDomain.includes("coursera") && !currentDomain.includes("crehana")) {
                        setInterval(() => {
                            passwordInput.setAttribute("type", "hidden")
                        }, 5)
                    }

                    await remove("product")
                })
            }
        }, 500)
    }

    async function loginButtonClick() {
        // trigger button
        await wait(0.2)
        let int3 = setInterval(async () => {
            let buttons = getFormButton()
            if (buttons.length > 0) {
                clearInterval(int3)
                await wait(0.5)
                buttons[0].style.opacity = ".5"
                await remove("product")
                buttons[0].click()
                await wait(0.2)
                initEvents(buttons[0], ["click", "mousedown", "mouseup", "mousemove", "mouseenter", "mouseleave", "mouseout"])
            }
        }, 500)
    }

    msg("Content script loaded")
}

// replae the placehodler credentials and try with real data
