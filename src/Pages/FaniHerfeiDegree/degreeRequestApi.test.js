import axios from "axios";
import { submitDegreeRequest } from "./degreeRequestApi";

jest.mock("axios", () => ({ post: jest.fn() }));
beforeEach(() => jest.clearAllMocks());
test("only a confirmed save with an identifier is treated as successful", async () => {
    const details = { firstName: "Student" };
    axios.post.mockResolvedValue({ data: { success: true, request: { id: "saved-id", createdAt: "2026-11-05" } } });
    await expect(submitDegreeRequest(details)).resolves.toEqual({ id: "saved-id", createdAt: "2026-11-05" });
    expect(axios.post).toHaveBeenCalledWith(expect.stringMatching(/\/api\/degree-requests$/), details, { timeout: 30000 });
    for (const data of [{ success: false }, { success: true, request: {} }, "<html>error</html>"]) {
        axios.post.mockResolvedValue({ data });
        await expect(submitDegreeRequest(details)).rejects.toMatchObject({ code: "REQUEST_FAILED" });
    }
});
test("retains structured field errors without copying Axios request data or logging personal information", async () => {
    const log = jest.spyOn(console, "error").mockImplementation(() => {});
    axios.post.mockRejectedValue({ config: { data: "private identity information" }, response: { status: 400, data: { code: "VALIDATION_ERROR", errors: { phone: "INVALID_PHONE" } } } });
    const result = await submitDegreeRequest({}).catch((error) => error);
    expect(result).toMatchObject({ status: 400, code: "VALIDATION_ERROR", fields: { phone: "INVALID_PHONE" } });
    expect(result.config).toBeUndefined();
    expect(log).not.toHaveBeenCalled();
    log.mockRestore();
});
