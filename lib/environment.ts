// environment.ts
export const IS_PREVIEW = process.env.NEXT_PUBLIC_VERCEL_ENV === "preview" || process.env.NODE_ENV === "development"
