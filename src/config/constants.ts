export const APP_CONFIG = {
  APP_NAME: "CationGate",
  VERSION: "1.0.0",
  POLLING_INTERVAL: {
    APPLICANTS: 15 * 1000, 
    STATISTICS: 60 * 1000, 
  },
  DEFAULT_LOGO: "/logo_smktb.png",
};

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  DASHBOARD: (slug?: string) => (slug ? `/${slug}/dashboard` : "/dashboard"),
};
