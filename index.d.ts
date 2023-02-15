import { Auth } from "firebase/auth";
import { Database } from "firebase/database";

declare module '#app' {
  interface NuxtApp {
    $auth: Auth
    $database: Database
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $auth: Auth
    $database: Database
  }
}

export { }