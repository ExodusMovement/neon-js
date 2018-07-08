import { u, CONST } from "@cityofzion/neon-core";
import { getToken, getTokenBalance } from "../src/main";

const TESTNET_URL = "http://test5.cityofzion.io:8880";
const RPX = CONST.CONTRACTS.TEST_RPX;

describe("getTokenBalance", () => {
  test("8 decimals contract", () => {
    return getTokenBalance(
      TESTNET_URL,
      RPX,
      "ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW"
    ).then(balance => {
      expect(balance instanceof u.Fixed8).toBe(true);
      expect(balance.toNumber()).toBeGreaterThan(0);
    });
  });

  test("0 decimals contract", () => {
    return getTokenBalance(
      TESTNET_URL,
      CONST.CONTRACTS.TEST_RHTT4,
      "ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW"
    ).then(balance => {
      expect(balance.toNumber()).toBeGreaterThan(0);
      expect(balance.toNumber() % 1).toBe(0);
    });
  });
});

describe("getToken", () => {
  test("without balance", () => {
    return getToken(TESTNET_URL, RPX).then(info => {
      expect(typeof info.name).toBe("string");
      expect(info.symbol).toMatch(/[A-Z]+/);
      expect(typeof info.decimals).toBe("number");
      expect(typeof info.totalSupply).toBe("number");
      expect(info.balance).toBeUndefined();
    });
  });

  test("with balance", () => {
    return getToken(TESTNET_URL, RPX, "ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW").then(
      info => {
        expect(typeof info.name).toBe("string");
        expect(info.symbol).toMatch(/[A-Z]+/);
        expect(typeof info.decimals).toBe("number");
        expect(typeof info.totalSupply).toBe("number");
        expect(info.balance).toBeDefined();
        const balanceNum = info.balance.toNumber();
        expect(balanceNum).toBeGreaterThan(0);
      }
    );
  });
});
