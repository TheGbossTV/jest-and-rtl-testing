import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ValidationForm from "./ValidationForm";

describe("ValidationForm", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  test("should render the form with no props", () => {
    render(<ValidationForm />);

    const form = screen.getByRole("form");
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText("Password");
    const confirmPasswordInput = screen.getByLabelText("Confirm Password");
    const submitButton = screen.getByRole("button", { name: /submit/i });

    expect(form).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(confirmPasswordInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  describe("Functionality", () => {
    test("should validate the form correctly", async () => {
      const onSubmit = jest.fn();
      const onValidationChange = jest.fn();
      render(
        <ValidationForm
          onSubmit={onSubmit}
          onValidationChange={onValidationChange}
        />
      );

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText("Password");
      const confirmPasswordInput = screen.getByLabelText("Confirm Password");
      const submitButton = screen.getByRole("button", { name: /submit/i });

      await user.type(emailInput, "test@test.com");
      await user.type(passwordInput, "password");
      await user.type(confirmPasswordInput, "password");
      await user.click(submitButton);

      expect(onSubmit).toHaveBeenCalledWith({
        email: "test@test.com",
        password: "password",
        confirmPassword: "password",
      });

      expect(onValidationChange).toHaveBeenCalledWith(true);

      await waitFor(() => {
        expect(submitButton).toBeDisabled();
        expect(submitButton).toHaveTextContent("Submitting...");
      });

      await waitFor(() => {
        expect(submitButton).toBeEnabled();
        expect(submitButton).toHaveTextContent("Submit");
      });
    });

    test("Show error when form is empty", async () => {
      render(<ValidationForm />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText("Password");
      const confirmPasswordInput = screen.getByLabelText("Confirm Password");
      const submitButton = screen.getByRole("button", { name: /submit/i });

      await user.click(submitButton);

      expect(emailInput).toHaveClass("error");
      expect(passwordInput).toHaveClass("error");
      expect(confirmPasswordInput).toHaveClass("error");
    });

    describe("Email validation", () => {
      test("Show error when email is missing", async () => {
        render(<ValidationForm />);

        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText("Password");
        const confirmPasswordInput = screen.getByLabelText("Confirm Password");
        const submitButton = screen.getByRole("button", { name: /submit/i });

        await user.type(passwordInput, "password");
        await user.type(confirmPasswordInput, "password");
        await user.click(submitButton);

        await waitFor(() => {
          const emailError = screen.getByTestId("email-error");
          expect(emailInput).toHaveClass("error");
          expect(emailError).toBeInTheDocument();
          expect(emailError).toHaveTextContent("Email is required");
        });
      });

      test("Show error when email is invalid", async () => {
        render(<ValidationForm />);

        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText("Password");
        const confirmPasswordInput = screen.getByLabelText("Confirm Password");
        const submitButton = screen.getByRole("button", { name: /submit/i });

        await user.type(emailInput, "invalid-email");
        await user.type(passwordInput, "password");
        await user.type(confirmPasswordInput, "password");
        await user.click(submitButton);

        await waitFor(() => {
          const emailError = screen.getByTestId("email-error");
          expect(emailInput).toHaveClass("error");
          expect(emailError).toBeInTheDocument();
          expect(emailError).toHaveTextContent(
            "Please enter a valid email address"
          );
        });
      });
    });

    describe("Password validation", () => {
      test("Show error when password is missing", async () => {
        render(<ValidationForm />);

        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText("Password");
        const confirmPasswordInput = screen.getByLabelText("Confirm Password");
        const submitButton = screen.getByRole("button", { name: /submit/i });

        await user.type(emailInput, "test@test.com");
        await user.type(confirmPasswordInput, "password");
        await user.click(submitButton);

        await waitFor(() => {
          const passwordError = screen.getByTestId("password-error");
          expect(passwordInput).toHaveClass("error");
          expect(passwordError).toBeInTheDocument();
          expect(passwordError).toHaveTextContent("Password is required");
        });
      });

      test("Show error when password is less than 6 characters", async () => {
        render(<ValidationForm />);

        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText("Password");
        const confirmPasswordInput = screen.getByLabelText("Confirm Password");
        const submitButton = screen.getByRole("button", { name: /submit/i });

        await user.type(emailInput, "test@test.com");
        await user.type(passwordInput, "12345");
        await user.type(confirmPasswordInput, "12345");
        await user.click(submitButton);

        await waitFor(() => {
          const passwordError = screen.getByTestId("password-error");
          expect(passwordInput).toHaveClass("error");
          expect(passwordError).toBeInTheDocument();
          expect(passwordError).toHaveTextContent(
            "Password must be at least 6 characters long"
          );
        });
      });
    });

    describe("Confirm password validation", () => {
      test("Show error when confirm password is missing", async () => {
        render(<ValidationForm />);

        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText("Password");
        const confirmPasswordInput = screen.getByLabelText("Confirm Password");
        const submitButton = screen.getByRole("button", { name: /submit/i });

        await user.type(emailInput, "test@test.com");
        await user.type(passwordInput, "password");
        await user.click(submitButton);

        await waitFor(() => {
          const confirmPasswordError = screen.getByTestId(
            "confirm-password-error"
          );
          expect(confirmPasswordInput).toHaveClass("error");
          expect(confirmPasswordError).toBeInTheDocument();
          expect(confirmPasswordError).toHaveTextContent(
            "Please confirm your password"
          );
        });
      });

      test("Show error when confirm password does not match password", async () => {
        render(<ValidationForm />);

        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText("Password");
        const confirmPasswordInput = screen.getByLabelText("Confirm Password");
        const submitButton = screen.getByRole("button", { name: /submit/i });

        await user.type(emailInput, "test@test.com");
        await user.type(passwordInput, "password");
        await user.type(confirmPasswordInput, "password1");
        await user.click(submitButton);

        await waitFor(() => {
          const confirmPasswordError = screen.getByTestId(
            "confirm-password-error"
          );
          expect(confirmPasswordInput).toHaveClass("error");
          expect(confirmPasswordError).toBeInTheDocument();
          expect(confirmPasswordError).toHaveTextContent(
            "Passwords do not match"
          );
        });
      });
    });
  });
});
