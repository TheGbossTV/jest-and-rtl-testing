import { render, screen, waitFor } from "@testing-library/react";
import TimerComponent from "./TimerComponent";
import user from "@testing-library/user-event";

describe("TimerComponent Tests", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test("should render with minimal props", () => {
    render(<TimerComponent />);

    const timerDisplay = screen.getByTestId("timer-display");
    expect(timerDisplay).toHaveTextContent("01:00");

    const timerStatus = screen.getByText(/status:/i);
    expect(timerStatus).toHaveTextContent("Status: paused");

    const startButton = screen.getByRole("button", { name: /start/i });
    expect(startButton).toBeInTheDocument();

    const pauseButton = screen.queryByRole("button", { name: /pause/i });
    expect(pauseButton).not.toBeInTheDocument();

    const restartButton = screen.queryByRole("button", { name: /restart/i });
    expect(restartButton).not.toBeInTheDocument();

    const resetButton = screen.getByRole("button", { name: /reset/i });
    expect(resetButton).toBeInTheDocument();
  });

  test("should work with custom initial time", () => {
    render(<TimerComponent initialTime={120} />); // 2 minutes

    const timerDisplay = screen.getByTestId("timer-display");
    expect(timerDisplay).toHaveTextContent("02:00");
  });

  test("should render with autoStart prop", async () => {
    render(<TimerComponent autoStart={true} />);

    const timerDisplay = screen.getByTestId("timer-display");
    const timerStatus = screen.getByText(/status:/i);
    const startButton = screen.queryByRole("button", { name: /start/i });
    const pauseButton = screen.getByRole("button", { name: /pause/i });
    const resetButton = screen.getByRole("button", { name: /reset/i });
    const restartButton = screen.queryByRole("button", { name: /restart/i });
    expect(timerDisplay).toHaveTextContent("01:00");
    expect(timerStatus).toHaveTextContent("Status: running");
    expect(startButton).not.toBeInTheDocument();
    expect(pauseButton).toBeInTheDocument();
    expect(resetButton).toBeInTheDocument();
    expect(restartButton).not.toBeInTheDocument();

    jest.advanceTimersByTime(1000);
    await waitFor(() => {
      expect(timerDisplay).toHaveTextContent("00:59");
    });
  });

  test("onTick and onTimeUp should be called", async () => {
    const onTick = jest.fn();
    const onTimeUp = jest.fn();
    render(
      <TimerComponent
        autoStart={true}
        onTick={onTick}
        onTimeUp={onTimeUp}
        initialTime={3}
      />
    );

    const timerDisplay = screen.getByTestId("timer-display");

    // Initially should show 3 seconds
    expect(timerDisplay).toHaveTextContent("00:03");

    // Use a loop to advance the timer and check expectations
    for (let i = 2; i >= 0; i--) {
      jest.advanceTimersByTime(1000);
      await waitFor(() => {
        expect(timerDisplay).toHaveTextContent(`00:0${i}`);
      });
      expect(onTick).toHaveBeenCalledWith(i);
    }
    expect(onTimeUp).toHaveBeenCalledTimes(1);
    expect(onTick).toHaveBeenCalledTimes(3);
  });

  describe("Buttons interactions", () => {
    test("start button should start the timer", async () => {
      render(<TimerComponent />);
      const startButton = screen.getByRole("button", { name: /start/i });
      const timerDisplay = screen.getByTestId("timer-display");

      expect(timerDisplay).toHaveTextContent("01:00");

      user.click(startButton);

      await waitFor(() => {
        expect(startButton).not.toBeInTheDocument();
        expect(timerDisplay).toHaveTextContent("00:59");
        expect(screen.getByText(/status:/i)).toHaveTextContent(
          "Status: running"
        );
      });
    });

    test("pause button should pause the timer", async () => {
      render(<TimerComponent autoStart={true} />);
      const pauseButton = screen.getByRole("button", { name: /pause/i });
      const timerDisplay = screen.getByTestId("timer-display");

      await waitFor(() => {
        expect(timerDisplay).toHaveTextContent("01:00");
      });

      jest.advanceTimersByTime(1000);
      user.click(pauseButton);

      await waitFor(() => {
        expect(pauseButton).not.toBeInTheDocument();
        expect(timerDisplay).toHaveTextContent("00:59");
        expect(screen.getByText(/status:/i)).toHaveTextContent(
          "Status: paused"
        );
      });
    });

    test("reset button should reset the timer", async () => {
      render(<TimerComponent autoStart={true} />);
      const resetButton = screen.getByRole("button", { name: /reset/i });
      const timerDisplay = screen.getByTestId("timer-display");

      expect(timerDisplay).toHaveTextContent("01:00");

      jest.advanceTimersByTime(2000);
      await waitFor(() => {
        expect(timerDisplay).toHaveTextContent("00:58");
      });

      user.click(resetButton);

      await waitFor(() => {
        expect(timerDisplay).toHaveTextContent("01:00");
      });
    });
  });

  test("Timer ends and displays 'Time's up!'", async () => {
    render(<TimerComponent autoStart={true} initialTime={1} />);
    const timerDisplay = screen.getByTestId("timer-display");

    await waitFor(() => {
      expect(timerDisplay).toHaveTextContent("00:01");
    });

    jest.advanceTimersByTime(1000);

    await waitFor(() => {
      expect(timerDisplay).toHaveTextContent("00:00");
      expect(screen.getByText(/time's up!/i)).toBeInTheDocument();
      expect(screen.getByText(/status:/i)).toHaveTextContent(
        "Status: completed"
      );
    });
  });
});
