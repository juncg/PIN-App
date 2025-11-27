import { isPasswordValid } from "./validPassword";
//ignore errors with test/expect
test("is this password valid?", () => {
  expect(isPasswordValid("hello")).toBe(false);
});