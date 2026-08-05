/**
 * safeRequest — wraps an async request function with graceful degradation.
 *
 * Usage:
 *   const { data, isMock } = await safeRequest(
 *       () => getMeetings(token),
 *       () => mockMeetings(),
 *       { timeout: 6000 }
 *   );
 *
 * On 401/403 the original error is re-thrown (auth handling should proceed normally).
 * On any other failure (network, 4xx/5xx, timeout), returns { data: mockDataFn(), isMock: true }.
 */

const AUTH_ERROR_CODES = [401, 403];

export const safeRequest = async (requestFn, mockDataFn, options = {}) => {
    const { timeout = 6000 } = options;

    try {
        // Race the real request against a timeout
        const result = await Promise.race([
            requestFn(),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error("SAFE_REQUEST_TIMEOUT")), timeout)
            ),
        ]);

        return { data: result, isMock: false };
    } catch (error) {
        // Let auth errors bubble up for normal handling (redirect to login, etc.)
        const status = error?.response?.status;
        if (status && AUTH_ERROR_CODES.includes(status)) {
            throw error;
        }

        // For everything else, fall back to mock data
        console.warn(
            "[safeRequest] Request failed, falling back to mock data:",
            error?.message || error
        );

        return { data: mockDataFn(), isMock: true };
    }
};

export default safeRequest;
