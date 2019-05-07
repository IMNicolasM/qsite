
export const RESET = (state) => {
  state.settings = []
  state.availableLocales = []
  state.availableThemes = []
  state.defaultLocale = ''
};

export function SET_SITE_SETTINGS(state, data) {
  state.settings = data
}

export function SET_AVAILABLE_LOCALES(state, data) {
  state.availableLocales = data
}

export function SET_AVAILABLE_THEMES(state, data) {
  state.availableThemes = data
}

export function SET_DEFAULT_LOCALE(state, data) {
  state.defaultLocale = data
}


