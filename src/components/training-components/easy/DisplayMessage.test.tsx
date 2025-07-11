import { render, screen } from "@testing-library/react";
import DisplayMessage from "./DisplayMessage";

describe("DisplayMessage", () => {
  describe("when message is rendered", () => {
    test("should render the message", () => {
      const message = "Hello, world!";
      render(<DisplayMessage message={message} />);

      expect(screen.getByText(message)).toBeInTheDocument();
    });

    test("should render with minimum props", () => {
      render(<DisplayMessage message="Hello, world!" />);

      expect(screen.getByText("Hello, world!")).toBeInTheDocument();
      expect(screen.queryByLabelText("message-icon")).not.toBeInTheDocument();
    });
  });

  describe("when showIcon", () => {
    test("should render icon if showIcon is true", () => {
      const message = "Hello, world!";
      render(<DisplayMessage message={message} showIcon={true} />);

      const icon = screen.getByLabelText("message-icon");

      expect(icon).toBeInTheDocument();
    });

    test("should not render icon if showIcon is false", () => {
      const message = "Hello, world!";
      render(<DisplayMessage message={message} showIcon={false} />);

      const icon = screen.queryByLabelText("message-icon");

      expect(icon).not.toBeInTheDocument();
    });
  });

  test.each([
    ["info", "ℹ️", "message-info"],
    ["success", "✅", "message-success"],
    ["error", "❌", "message-error"],
    ["warning", "⚠️", "message-warning"],
  ])(
    "should render correct icon and class for type %s",
    (type, expectedIcon, expectedClass) => {
      render(
        <DisplayMessage
          message="Test"
          type={type as "info" | "success" | "error" | "warning"}
          showIcon={true}
        />
      );

      expect(screen.getByTestId("display-message")).toHaveClass(expectedClass);
      expect(screen.getByLabelText("message-icon")).toHaveTextContent(
        expectedIcon
      );
    }
  );
});
