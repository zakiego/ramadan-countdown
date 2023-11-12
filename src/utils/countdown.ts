export function createCountdown({
  nextRamadan,
  timezoneOffset,
}: {
  nextRamadan: Date;
  timezoneOffset: number;
}) {
  const currentDate = new Date();
  const currentDateWithTimezoneOffset = new Date(
    currentDate.getTime() + timezoneOffset * 60 * 60 * 1000,
  );
  const ramadanStartDate = nextRamadan;

  const { days, hours, minutes, seconds } = calculateTimeDifference(
    ramadanStartDate,
    currentDateWithTimezoneOffset,
  );

  return {
    ramadanStartDate,
    currentDate: currentDateWithTimezoneOffset,
    timezoneOffset,
    countdown: { days, hours, minutes, seconds },
  };
}

export type CreateCountdown = ReturnType<typeof createCountdown>;

function calculateTimeDifference(targetDate: Date, currentDate: Date) {
  const difference = targetDate.getTime() - currentDate.getTime();
  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / 1000 / 60) % 60);
  const seconds = Math.floor((difference / 1000) % 60);
  return { days, hours, minutes, seconds };
}
