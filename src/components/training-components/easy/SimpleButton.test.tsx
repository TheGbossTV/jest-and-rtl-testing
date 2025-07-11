import { render, screen } from "@testing-library/react";
import user from "@testing-library/user-event";
import SimpleButton from "./SimpleButton";

describe("SimpleButton Tests", () => {
  test("should render the button", () => {
    render(<SimpleButton text="Click me" />);

    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  test("should render with minimal props", () => {
    render(<SimpleButton text="Click me" />);

    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("btn btn-primary");
    expect(button).not.toBeDisabled();
  });

  test("should render with disabled state", async () => {
    const onClick = jest.fn();
    render(<SimpleButton text="Click me" disabled={true} onClick={onClick} />);

    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeDisabled();
    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  test("clicking the button should call onClick", async () => {
    const onClick = jest.fn();
    render(<SimpleButton text="Click me" onClick={onClick} />);

    const button = screen.getByRole("button", { name: /click me/i });
    await user.click(button);
    expect(onClick).toHaveBeenCalled();
  });

  test.each([
    ["primary", "btn-primary"],
    ["secondary", "btn-secondary"],
  ])("should render with variant %s", (variant, expectedClass) => {
    render(
      <SimpleButton
        text="Click me"
        variant={variant as "primary" | "secondary"}
      />
    );

    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toHaveClass(expectedClass);
  });
});
