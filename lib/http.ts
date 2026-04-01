export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "HttpError";
  }
}

export async function fetchJSON<T>(
  url: string,
  init: RequestInit = {},
): Promise<T> {
  try {
    const res = await fetch(url, {
      ...init,
      headers: { Accept: "application/json", ...(init.headers ?? {}) },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new HttpError(res.status, data?.detail ?? `HTTP ${res.status}`);
    }

    return data as T;
  } catch (err) {
    if (err instanceof HttpError) throw err;
    throw new HttpError(0, "Network error");
  }
}
