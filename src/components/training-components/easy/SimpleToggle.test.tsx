import { render, screen } from "@testing-library/react";
import user from "@testing-library/user-event";
import SimpleToggle from "./SimpleToggle";

describe("SimpleToggle Tests", () => {
  test("should render with minimal props", () => {
    render(<SimpleToggle />);

    const toggle = screen.getByRole("checkbox");
    expect(toggle).toBeInTheDocument();
    expect(toggle).not.toBeChecked();
  });

  test("should render with props", () => {
    const label = "Test Toggle";
    render(
      <SimpleToggle initialValue={true} onToggle={jest.fn()} label={label} />
    );

    const toggleButton = screen.getByRole("checkbox");
    const status = screen.getByText(/status:/i);

    expect(toggleButton).toBeChecked();
    expect(status).toHaveTextContent("Status: ON");
    expect(screen.getByLabelText("checkbox-label")).toHaveTextContent(label);
  });

  test("should call onToggle when toggled", async () => {
    const onToggle = jest.fn();
    render(<SimpleToggle initialValue={false} onToggle={onToggle} />);

    const toggleText = screen.getByText(/status/i);
    const toggleButton = screen.getByRole("checkbox");
    expect(toggleButton).not.toBeChecked();
    expect(toggleText).toHaveTextContent("Status: OFF");

    await user.click(toggleButton);

    expect(onToggle).toHaveBeenCalledWith(true);
    expect(toggleButton).toBeChecked();
    expect(toggleText).toHaveTextContent("Status: ON");
  });
});
