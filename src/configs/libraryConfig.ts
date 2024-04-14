export const LibraryConfig = {
  GoogleClientId: import.meta.env[`VITE_GOOGLE_CLIENT_ID`],
  FacebookClientId: import.meta.env[`VITE_FACEBOOK_CLIENT_ID`]
} as const
