import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { NinjaNameGeneratorPage } from "../../pages/NinjaNameGeneratorPage";

describe("NinjaGeneratorPage", () => {
  describe("When the component is rendered, the form inputs start empty and the generate button is disabled", () => {
    test("Card number input starts empty", () => {
      render(<NinjaNameGeneratorPage />);
      const cardInput = screen.getByPlaceholderText(
        "Os 16 números do cartão da sua mãe"
      );
      expect(cardInput).toHaveValue("");
    });

    test("CVV input starts empty", () => {
      render(<NinjaNameGeneratorPage />);
      const cvvInput = screen.getByPlaceholderText("Os 3 números do verso");
      expect(cvvInput).toHaveValue("");
    });

    test("Expiration date input starts empty", () => {
      render(<NinjaNameGeneratorPage />);
      const expDateInput = screen.getByPlaceholderText("A data de validade");
      expect(expDateInput).toHaveValue("");
    });

    test("Generate button starts disabled", () => {
      render(<NinjaNameGeneratorPage />);
      const generateButton = screen.getByRole("button", { name: /gerar/i });
      expect(generateButton).toBeDisabled();
    });
  });

  describe("When any of the fields is empty or invalid, the generate button is disabled", () => {
    test("When card number field is empty, button is disabled", async () => {
      render(<NinjaNameGeneratorPage />);
      const user = userEvent.setup();

      const cvvInput = screen.getByPlaceholderText("Os 3 números do verso");
      const expDateInput = screen.getByPlaceholderText("A data de validade");
      const generateButton = screen.getByRole("button", { name: /gerar/i });

      await user.type(expDateInput, "05/2025");
      await user.type(cvvInput, "123");

      expect(generateButton).toBeDisabled();
    });

    test("When card number field is invalid, button is disabled", async () => {
      render(<NinjaNameGeneratorPage />);
      const user = userEvent.setup();

      const cardInput = screen.getByPlaceholderText(
        "Os 16 números do cartão da sua mãe"
      );
      const cvvInput = screen.getByPlaceholderText("Os 3 números do verso");
      const expDateInput = screen.getByPlaceholderText("A data de validade");
      const generateButton = screen.getByRole("button", { name: /gerar/i });

      await user.type(expDateInput, "05/2025");
      await user.type(cardInput, "12345678");
      await user.type(cvvInput, "123");

      expect(generateButton).toBeDisabled();
    });

    test("When CVV field is empty, button is disabled", async () => {
      render(<NinjaNameGeneratorPage />);
      const user = userEvent.setup();

      const cardInput = screen.getByPlaceholderText(
        "Os 16 números do cartão da sua mãe"
      );
      const expDateInput = screen.getByPlaceholderText("A data de validade");
      const generateButton = screen.getByRole("button", { name: /gerar/i });

      await user.type(expDateInput, "05/2025");
      await user.type(cardInput, "1234567812345678");

      expect(generateButton).toBeDisabled();
    });

    test("When CVV field is invalid, button is disabled", async () => {
      render(<NinjaNameGeneratorPage />);
      const user = userEvent.setup();

      const cardInput = screen.getByPlaceholderText(
        "Os 16 números do cartão da sua mãe"
      );
      const cvvInput = screen.getByPlaceholderText("Os 3 números do verso");
      const expDateInput = screen.getByPlaceholderText("A data de validade");
      const generateButton = screen.getByRole("button", { name: /gerar/i });

      await user.type(expDateInput, "05/2025");
      await user.type(cardInput, "1234567812345678");
      await user.type(cvvInput, "1");

      expect(generateButton).toBeDisabled();
    });

    test("When expiration date field is empty, button is disabled", async () => {
      render(<NinjaNameGeneratorPage />);
      const user = userEvent.setup();

      const cardInput = screen.getByPlaceholderText(
        "Os 16 números do cartão da sua mãe"
      );
      const cvvInput = screen.getByPlaceholderText("Os 3 números do verso");
      const generateButton = screen.getByRole("button", { name: /gerar/i });

      await user.type(cardInput, "1234567812345678");
      await user.type(cvvInput, "123");

      expect(generateButton).toBeDisabled();
    });

    test("When expiration date field is invalid, button is disabled", async () => {
      render(<NinjaNameGeneratorPage />);
      const user = userEvent.setup();

      const cardInput = screen.getByPlaceholderText(
        "Os 16 números do cartão da sua mãe"
      );
      const cvvInput = screen.getByPlaceholderText("Os 3 números do verso");
      const expDateInput = screen.getByPlaceholderText("A data de validade");
      const generateButton = screen.getByRole("button", { name: /gerar/i });

      await user.type(expDateInput, "05/2023");
      await user.type(cardInput, "1234567812345678");
      await user.type(cvvInput, "123");

      expect(generateButton).toBeDisabled();
    });
  });

  test("When we fill all the fields correctly, the generate button gets enabled", async () => {
    render(<NinjaNameGeneratorPage />);
    const user = userEvent.setup();

    const cardInput = screen.getByPlaceholderText(
      "Os 16 números do cartão da sua mãe"
    );
    const cvvInput = screen.getByPlaceholderText("Os 3 números do verso");
    const expDateInput = screen.getByPlaceholderText("A data de validade");
    const generateButton = screen.getByRole("button", { name: /gerar/i });

    await user.type(expDateInput, "05/2025");
    await user.type(cardInput, "1234567812345678");
    await user.type(cvvInput, "123");

    expect(generateButton).toBeEnabled();
  });

  test("When we click the generate button, the page shows our generated ninja name", async () => {
    render(<NinjaNameGeneratorPage />);
    const user = userEvent.setup();

    const cardInput = screen.getByPlaceholderText(
      "Os 16 números do cartão da sua mãe"
    );
    const cvvInput = screen.getByPlaceholderText("Os 3 números do verso");
    const expDateInput = screen.getByPlaceholderText("A data de validade");
    const generateButton = screen.getByRole("button", { name: /gerar/i });

    await user.type(expDateInput, "05/2025");
    await user.type(cardInput, "1234567812345678");
    await user.type(cvvInput, "123");
    await user.click(generateButton);

    const ninjaName = await screen.findByText(/seu nome é:/i);

    expect(ninjaName).toBeInTheDocument();
  });

  test("When we generate a ninja name and click the back button, it should show the empty form again", async () => {
    render(<NinjaNameGeneratorPage />);
    const user = userEvent.setup();

    const cardInput = screen.getByPlaceholderText(
      "Os 16 números do cartão da sua mãe"
    );
    const cvvInput = screen.getByPlaceholderText("Os 3 números do verso");
    const expDateInput = screen.getByPlaceholderText("A data de validade");
    const generateButton = screen.getByRole("button", { name: /gerar/i });

    await user.type(expDateInput, "05/2025");
    await user.type(cardInput, "1234567812345678");
    await user.type(cvvInput, "123");
    await user.click(generateButton);

    const backButton = await screen.findByRole("button", { name: /voltar/i });
    await user.click(backButton);

    const newCardInput = screen.getByPlaceholderText(
      "Os 16 números do cartão da sua mãe"
    );
    const newCvvInput = screen.getByPlaceholderText("Os 3 números do verso");
    const newExpDateInput = screen.getByPlaceholderText("A data de validade");
    const newGenerateButton = screen.getByRole("button", { name: /gerar/i });

    expect(newCardInput).toHaveValue("");
    expect(newCvvInput).toHaveValue("");
    expect(newExpDateInput).toHaveValue("");
    expect(newGenerateButton).toBeDisabled();
  });
});
