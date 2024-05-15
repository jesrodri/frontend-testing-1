import { describe, expect, test } from "vitest";
import { useCardForm } from "../../hooks/useCardForm";
import { act, renderHook } from "@testing-library/react";
import dayjs from "dayjs";

describe("useCardForm", () => {
  describe("When the hook is rendered, it starts with empty values for the three fields", () => {
    test("cardNumber has empty value", () => {
      const { result } = renderHook(() => useCardForm());
      expect(result.current.cardNumber).toBe("");
    });

    test("cardVerificationValue has empty value", () => {
      const { result } = renderHook(() => useCardForm());
      expect(result.current.cardVerificationValue).toBe("");
    });

    test("cardExpirationDate has empty value", () => {
      const { result } = renderHook(() => useCardForm());
      expect(result.current.cardExpirationDate).toBe(null);
    });
  });

  describe("When setting the card number, it should filter out all non-digit characters", () => {
    test("Setting card number with letters", () => {
      const { result } = renderHook(() => useCardForm());

      act(() => {
        result.current.setCardNumber("abc123d456fghj");
      });

      expect(result.current.cardNumber).toBe("123456");
    });

    test("Setting card number with letters and spaces", () => {
      const { result } = renderHook(() => useCardForm());

      act(() => {
        result.current.setCardNumber("abc123 d4 56fg hj");
      });

      expect(result.current.cardNumber).toBe("123456");
    });

    test("Setting card number with special chars", () => {
      const { result } = renderHook(() => useCardForm());

      act(() => {
        result.current.setCardNumber("12!@%34&*#56");
      });

      expect(result.current.cardNumber).toBe("123456");
    });

    test("Setting card number with numbers and spaces", () => {
      const { result } = renderHook(() => useCardForm());

      act(() => {
        result.current.setCardNumber("1234 5678 1234 5678");
      });

      expect(result.current.cardNumber).toBe("1234567812345678");
    });
  });

  test("When setting the card number, it should limit it's size to 16 characters", () => {
    const { result } = renderHook(() => useCardForm());

    act(() => {
      result.current.setCardNumber("12345678123456781234");
    });

    expect(result.current.cardNumber).toBe("1234567812345678");
  });

  describe("When setting the card verification value, it should filter out non-digit characters", () => {
    test("Setting card verification value with letters", () => {
      const { result } = renderHook(() => useCardForm());

      act(() => {
        result.current.setCardVerificationValue("abc123defg");
      });

      expect(result.current.cardVerificationValue).toBe("123");
    });

    test("Setting card verification value with letters and spaces", () => {
      const { result } = renderHook(() => useCardForm());

      act(() => {
        result.current.setCardVerificationValue("abc12 3 d fg hj");
      });

      expect(result.current.cardVerificationValue).toBe("123");
    });

    test("Setting card card verification with special chars", () => {
      const { result } = renderHook(() => useCardForm());

      act(() => {
        result.current.setCardVerificationValue("12!@%3&*#");
      });

      expect(result.current.cardVerificationValue).toBe("123");
    });

    test("Setting card card verification with numbers and spaces", () => {
      const { result } = renderHook(() => useCardForm());

      act(() => {
        result.current.setCardVerificationValue("1 2 3");
      });

      expect(result.current.cardVerificationValue).toBe("123");
    });
  });

  test("When setting the card verification value, it should limit it's size to 3 characters", () => {
    const { result } = renderHook(() => useCardForm());

    act(() => {
      result.current.setCardVerificationValue("12345678");
    });

    expect(result.current.cardVerificationValue).toBe("123");
  });

  describe("When we set the three fields to valid values, it returns isValid as true", () => {
    test("isValid is true if expiration date year is after current year", () => {
      const { result } = renderHook(() => useCardForm());
      const date = dayjs().add(2, "years");

      act(() => {
        result.current.setCardNumber("1234567812345678");
        result.current.setCardVerificationValue("123");
        result.current.setCardExpirationDate(date);
      });

      expect(result.current.isValid).toBe(true);
    });

    test("isValid is true if expiration date year equals current year but month is after", () => {
      const { result } = renderHook(() => useCardForm());
      const date = dayjs().add(2, "months");

      act(() => {
        result.current.setCardNumber("1234567812345678");
        result.current.setCardVerificationValue("123");
        result.current.setCardExpirationDate(date);
      });

      expect(result.current.isValid).toBe(true);
    });
  });

  describe("When we set any of the fields is invalid, it returns isValid as false", () => {
    test("isValid is false if card number is invalid", () => {
      const { result } = renderHook(() => useCardForm());
      const date = dayjs().add(2, "years");

      act(() => {
        result.current.setCardNumber("12345678");
        result.current.setCardVerificationValue("123");
        result.current.setCardExpirationDate(date);
      });

      expect(result.current.isValid).toBe(false);
    });

    test("isValid is false if card verification value is invalid", () => {
      const { result } = renderHook(() => useCardForm());
      const date = dayjs().add(2, "years");

      act(() => {
        result.current.setCardNumber("1234567812345678");
        result.current.setCardVerificationValue("12");
        result.current.setCardExpirationDate(date);
      });

      expect(result.current.isValid).toBe(false);
    });

    test("isValid is false if card expiration date is invalid", () => {
      const { result } = renderHook(() => useCardForm());
      const date = dayjs().subtract(2, "years");

      act(() => {
        result.current.setCardNumber("1234567812345678");
        result.current.setCardVerificationValue("123");
        result.current.setCardExpirationDate(date);
      });

      expect(result.current.isValid).toBe(false);
    });

    test("isValid is false if expiration date year equals current year but month is before", () => {
      const { result } = renderHook(() => useCardForm());
      const date = dayjs().subtract(2, "months");

      act(() => {
        result.current.setCardNumber("1234567812345678");
        result.current.setCardVerificationValue("123");
        result.current.setCardExpirationDate(date);
      });

      expect(result.current.isValid).toBe(false);
    });
  });
});
