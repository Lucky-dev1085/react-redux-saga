/* 
Menu Types:
"menu-default", "menu-sub-hidden", "menu-hidden"
*/
export const defaultMenuType = "menu-default";

export const subHiddenBreakpoint = 1440;
export const menuHiddenBreakpoint = 768;
export const defaultLocale = "en";
export const localeOptions = [
  { id: "en", name: "English - LTR", direction: "ltr" },
  { id: "es", name: "Español", direction: "ltr" },
  { id: "enrtl", name: "English - RTL", direction: "rtl" }
];

// export const firebaseConfig = {
//   apiKey: "AIzaSyBBksq-Asxq2M4Ot-75X19IyrEYJqNBPcg",
//   authDomain: "gogo-react-login.firebaseapp.com",
//   databaseURL: "https://gogo-react-login.firebaseio.com",
//   projectId: "gogo-react-login",
//   storageBucket: "gogo-react-login.appspot.com",
//   messagingSenderId: "216495999563"
// };

export const firebaseConfig = {
  apiKey: "AIzaSyCEoXxUXcpc_cg81tO-USjxr1pLHwmyJ1w",
  authDomain: "gogo-react-login-511d1.firebaseapp.com",
  databaseURL: "https://gogo-react-login-511d1.firebaseio.com/",
  projectId: "gogo-react-login-511d1",
  storageBucket: "gs://gogo-react-login-511d1.appspot.com/",
  messagingSenderId: "386384524280"
};

export const searchPath = "/app/pages/search";
export const servicePath = "https://api.coloredstrategies.com";

/* 
Color Options:
"light.purple", "light.blue", "light.green", "light.orange", "light.red", "dark.purple", "dark.blue", "dark.green", "dark.orange", "dark.red"
*/
export const isMultiColorActive = true;
export const defaultColor = "light.purple";
export const defaultDirection = "ltr";
export const isDarkSwitchActive = true;
export const themeColorStorageKey="__theme_color";
export const themeRadiusStorageKey = "__theme_radius";
export const isDemo = false;