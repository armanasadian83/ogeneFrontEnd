import axios from "axios";

export async function submitDegreeRequest(details) {
    try {
        const baseUrl = (process.env.REACT_APP_BASE_URL || "").replace(/\/$/, "");
        const { data } = await axios.post(`${baseUrl}/api/degree-requests`, details, { timeout: 30000 });
        if (data?.success !== true || typeof data.request?.id !== "string" || !data.request.id.trim()) {
            throw new Error("INVALID_RESPONSE");
        }
        return data.request;
    } catch (source) {
        // Do not expose or log Axios's request config: it contains identity data.
        const error = new Error("Certificate request could not be confirmed");
        error.status = source.response?.status;
        error.code = source.response?.data?.code || "REQUEST_FAILED";
        error.fields = source.response?.data?.errors;
        throw error;
    }
}
