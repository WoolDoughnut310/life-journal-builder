import { retrieveImage } from "./images";

test("retrieves from correct endpoint", async () => {
    const url = await retrieveImage("2023");
    expect(url).toEqual(expect.stringContaining("gateway.storjshare.io"));
})
