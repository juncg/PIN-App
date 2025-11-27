import { isPasswordValid } from "./validPassword";
//ignore errors with test/expect
test("basic password", () => {
  expect(isPasswordValid("hello")).toBe(false);
});

test("only numbers", () => {
  expect(isPasswordValid("123123")).toBe(false);
});

test("only symbols", () => {
  expect(isPasswordValid("?!?´`")).toBe(false);
});

test("only uppercase", () => {
  expect(isPasswordValid("HELLO")).toBe(false);
});

test("valid password", () => {
  expect(isPasswordValid("JuanCarlos123!")).toBe(true);
});