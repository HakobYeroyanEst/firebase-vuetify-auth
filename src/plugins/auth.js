import Vue from "vue"
import store from "@/store"
import router from "@/router"
import firebase from "@/middleware/firebase"
import AuthGuard from "../wrapper"

const authGuardSettings = {
  debug: true,
  session: "local", // or "browser" see: https://firebase.google.com/docs/auth/web/auth-state-persistence
  store,
  router,
  firebase,
  saml: false,
  saml_text: "Login with OKTA",
  saml_provider_id: "saml.okta",
  email: true,
  phone: false,
  google: false,
  facebook: false,
  registration: true,
  verification: true,

  title: "AUTH DEMO",
  subtitle: "Firebase Auth Demo for Veutify",
  icon: "mdi-test-tube",
  iconColor: "#FF6D00",
}

Vue.use(AuthGuard, authGuardSettings)
