import { describe, expect, test } from "vitest";
import { render, RenderResult } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { NinjaNameGeneratorPage } from "../../pages/NinjaNameGeneratorPage";

const componentSetup = () => {
  const screen = render(<NinjaNameGeneratorPage />);
  const user = userEvent.setup();

  return { screen, user };
};

const formQueries = (
  screen: RenderResult<
    typeof import("@testing-library/dom/types/queries"),
    HTMLElement,
    HTMLElement
  >
) => {
  const cardInput = screen.getByRole("textbox", { name: /card number/i });
  const cvvInput = screen.getByRole("textbox", {
    name: /card verification value/i,
  });
  const expDateInput = screen.getByRole("textbox", {
    name: /card expiration date/i,
  });
  const generateButton = screen.getByRole("button", { name: /gerar/i });

  return {
    cardInput,
    cvvInput,
    expDateInput,
    generateButton,
  };
};

describe("NinjaNameGeneratorPage", () => {
  describe("When the component is rendered", () => {
    test("Card number input starts empty", () => {
      const { screen } = componentSetup();
      const { cardInput } = formQueries(screen);
      expect(cardInput).toHaveValue("");
    });

    test("CVV input starts empty", () => {
      const { screen } = componentSetup();
      const { cvvInput } = formQueries(screen);
      expect(cvvInput).toHaveValue("");
    });

    test("Expiration date input starts empty", () => {
      const { screen } = componentSetup();
      const { expDateInput } = formQueries(screen);
      expect(expDateInput).toHaveValue("");
    });

    test("Generate button starts disabled", () => {
      const { screen } = componentSetup();
      const { generateButton } = formQueries(screen);
      expect(generateButton).toBeDisabled();
    });
  });

  describe("When any of the fields is empty or invalid", () => {
    test("When card number field is empty, button is disabled", async () => {
      const { screen, user } = componentSetup();

      const { cvvInput, expDateInput, generateButton } = formQueries(screen);

      await user.type(expDateInput, "05/2025");
      await user.type(cvvInput, "123");

      expect(generateButton).toBeDisabled();
    });

    test("When card number field is invalid, button is disabled", async () => {
      const { screen, user } = componentSetup();

      const { cardInput, cvvInput, expDateInput, generateButton } =
        formQueries(screen);

      await user.type(expDateInput, "05/2025");
      await user.type(cardInput, "12345678");
      await user.type(cvvInput, "123");

      expect(generateButton).toBeDisabled();
    });

    test("When CVV field is empty, button is disabled", async () => {
      const { screen, user } = componentSetup();

      const { cardInput, expDateInput, generateButton } = formQueries(screen);

      await user.type(expDateInput, "05/2025");
      await user.type(cardInput, "1234567812345678");

      expect(generateButton).toBeDisabled();
    });

    test("When CVV field is invalid, button is disabled", async () => {
      const { screen, user } = componentSetup();

      const { cardInput, cvvInput, expDateInput, generateButton } =
        formQueries(screen);

      await user.type(expDateInput, "05/2025");
      await user.type(cardInput, "1234567812345678");
      await user.type(cvvInput, "1");

      expect(generateButton).toBeDisabled();
    });

    test("When expiration date field is empty, button is disabled", async () => {
      const { screen, user } = componentSetup();

      const { cardInput, cvvInput, generateButton } = formQueries(screen);

      await user.type(cardInput, "1234567812345678");
      await user.type(cvvInput, "123");

      expect(generateButton).toBeDisabled();
    });

    test("When expiration date field is invalid, button is disabled", async () => {
      const { screen, user } = componentSetup();

      const { cardInput, cvvInput, expDateInput, generateButton } =
        formQueries(screen);

      await user.type(expDateInput, "05/2023");
      await user.type(cardInput, "1234567812345678");
      await user.type(cvvInput, "123");

      expect(generateButton).toBeDisabled();
    });
  });

  test("When we fill all the fields correctly, the generate button gets enabled", async () => {
    const { screen, user } = componentSetup();

    const { cardInput, cvvInput, expDateInput, generateButton } =
      formQueries(screen);

    await user.type(expDateInput, "05/2025");
    await user.type(cardInput, "1234567812345678");
    await user.type(cvvInput, "123");

    expect(generateButton).toBeEnabled();
  });

  test("When we click the generate button, the page shows our generated ninja name", async () => {
    const { screen, user } = componentSetup();

    const { cardInput, cvvInput, expDateInput, generateButton } =
      formQueries(screen);

    await user.type(expDateInput, "05/2025");
    await user.type(cardInput, "1234567812345678");
    await user.type(cvvInput, "123");
    await user.click(generateButton);

    const ninjaName = await screen.findByText(/seu nome é:/i);

    expect(ninjaName).toBeInTheDocument();
  });

  test("When we generate a ninja name and click the back button, it should show the empty form again", async () => {
    const { screen, user } = componentSetup();

    const { cardInput, cvvInput, expDateInput, generateButton } =
      formQueries(screen);

    await user.type(expDateInput, "05/2025");
    await user.type(cardInput, "1234567812345678");
    await user.type(cvvInput, "123");
    await user.click(generateButton);

    const backButton = await screen.findByRole("button", { name: /voltar/i });
    await user.click(backButton);

    const {
      cardInput: newCardInput,
      cvvInput: newCvvInput,
      expDateInput: newExpDateInput,
      generateButton: newGenerateButton,
    } = formQueries(screen);

    expect(newCardInput).toHaveValue("");
    expect(newCvvInput).toHaveValue("");
    expect(newExpDateInput).toHaveValue("");
    expect(newGenerateButton).toBeDisabled();
  });
});
