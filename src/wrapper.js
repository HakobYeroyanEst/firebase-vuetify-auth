import { VueMaskDirective } from "v-mask"

import backupStore from "./store"

// vuex store namespace
import AuthStore from "./store/auth"

// default npm package init config
import defaultSettings from "./store/defaultSettings"

// Import vue component
import AuthGuard from "./components/Guard.vue"

// Import router middleware
import AuthMiddleware from "./components/authguard"

// Declare install function executed by Vue.use()
export function install(Vue, options = {}) {
  if (install.installed) return

  install.installed = true

  // merge default settings with user settings
  const config = { ...defaultSettings, ...options }
  const { router, firebase, session = "local", debug } = config

  let { store } = config

  // verify if required dependency instances are passed to this package config
  if (debug) {
    if (router === null) {
      console.error("[ auth guard ]: ERROR: vue router instance missing in AuthenticationGuard config!")
    }
    if (firebase === null) {
      console.error("[ auth guard ]: ERROR: firebase instance missing in AuthenticationGuard config!")
    }
    if (store === null) {
      console.error("[ auth guard ]: WARNING: VueX store instance missing in AuthenticationGuard config!")
    }
  }
  if (store === null) {
    // use backup store if none passed in options - backwards compatibility
    store = backupStore
  }

  // register vuex store namespace
  store.registerModule("auth", AuthStore)

  if (debug) console.log("[ auth guard ]: registering VueX namespace: auth")

  // save store in Vue.prototype to be accessible authcheck.js
  Vue.prototype.$authGuardDebug = debug
  Vue.prototype.$authGuardStore = store
  Vue.prototype.$authGuardRouter = router
  Vue.prototype.$authGuardSession = session
  Vue.prototype.$authGuardFirebaseApp = firebase

  delete config.store
  delete config.router
  delete config.firebase

  // commit npm package config to vuex store
  store.commit("auth/SET_CONFIG", config)

  Vue.directive("mask", VueMaskDirective)
  Vue.component("AuthenticationGuard", AuthGuard)
}

// Create module definition for Vue.use()
const plugin = {
  install,
}

// Auto-install when vue is found (eg. in browser via <script> tag)
let GlobalVue = null

if (typeof window !== "undefined") {
  GlobalVue = window.Vue
} else if (typeof global !== "undefined") {
  GlobalVue = global.Vue
}
if (GlobalVue) {
  GlobalVue.use(plugin)
}

export { AuthMiddleware } // export vue router middleware

export default plugin // export plugin install function
