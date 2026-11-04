// Body of every API error. Success bodies are { success: true, data }, typed through hc<AppType>.
export type ApiErrorBody = {
  success: false;
  error: string;
  issues?: Record<string, string[] | undefined>;
};
