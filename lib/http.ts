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
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : "Network error");
  }
  // ==========================================
  // DEBUG LOG START
  // ==========================================
  console.log("====================================================");
  console.log("URL:", url);
  console.log("STATUS:", res.status);

  // ==========================================

  if (res.status !== 200) {
    // Try to read the upstream error message from the response body
    let message = "";
    try {
      const body = await res.json();
      message = body?.message || body?.error || "";
    } catch {
      // body wasn't JSON — ignore
    }

    if (errors) {
      throw new ApiError(
        res.status,
        message || errors[res.status] || `Unexpected error (${res.status})`,
      );
    }

    throw new Error(message || `Request failed (${res.status})`);
  }

  const text = await res.text();
  console.log("==================== BODY ==========================");
  console.log(text || "EMPTY RESPONSE BODY");
  console.log("====================================================");
  if (!text) throw new Error("Empty response body");

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error("Invalid JSON response");
  }
}
