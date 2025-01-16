
import { add } from "../App";


describe('Basic Test Suite', () => {
    test('adds two numbers correctly', () => {
      const add = (a: number, b: number) => a + b;

      expect(add(2, 2)).toBe(4);
    });
  
    test('concatenates strings', () => {
      const concat = (a: string, b: string) => a + b;
      expect(concat('Hello, ', 'World!')).toBe('Hello, World!');
    });
  
    // This test will fail to demonstrate PR blocking
    test('this test will fail', () => {
      const shouldBeTrue = false;
      expect(shouldBeTrue).toBe(false);
    });
  });