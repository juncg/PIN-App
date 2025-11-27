import { sum } from "./sum";
//ignore errors with test/expect
test("adds two numbers correctly", () => {
  expect(sum(2, 3)).toBe(5);
});