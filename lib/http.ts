/**
 * Map of HTTP status codes to custom error messages.
 * Pass this to `fetchJSON` when you know the API's error codes.
 */
export type ErrorMap = Record<number, string>;

/**
 * Thrown when an `ErrorMap` is provided — meaning you declared
 * knowledge of the API. Carries the status code regardless of
 * whether the specific code was in the map.
 */
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function fetchJSON<T>(
  url: string,
  init: RequestInit = {},
  errors?: ErrorMap,
): Promise<T> {
  let res: Response;

  try {
    res = await fetch(url, {
      ...init,
      headers: { Accept: "application/json", ...(init.headers ?? {}) },
    });
  } catch {
    throw new Error("Network error");
  }

  if (res.status !== 200) {
    if (errors) {
      throw new ApiError(
        res.status,
        errors[res.status] ?? `Unexpected error (${res.status})`,
      );
    }

    throw new Error(`Request failed (${res.status})`);
  }

  return (await res.json()) as T;
}
