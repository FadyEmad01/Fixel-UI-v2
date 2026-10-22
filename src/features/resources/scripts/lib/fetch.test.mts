import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { isPrivateAddress } from "./fetch.mts";

describe("isPrivateAddress", () => {
  it("blocks loopback, LAN, link-local, and cloud metadata", () => {
    for (const address of [
      "127.0.0.1",
      "10.1.2.3",
      "172.16.0.1",
      "172.31.255.254",
      "192.168.1.10",
      "169.254.169.254",
      "100.64.0.1",
      "0.0.0.0",
      "224.0.0.1",
      "::1",
      "::",
      "fd00::1",
      "fe80::1",
      "::ffff:192.168.1.1",
    ]) {
      assert.equal(isPrivateAddress(address), true, address);
    }
  });

  it("allows public addresses", () => {
    for (const address of [
      "8.8.8.8",
      "1.1.1.1",
      "172.32.0.1",
      "2606:4700:4700::1111",
    ]) {
      assert.equal(isPrivateAddress(address), false, address);
    }
  });

  it("treats unparseable values as not-an-address", () => {
    assert.equal(isPrivateAddress("example.com"), false);
  });
});
