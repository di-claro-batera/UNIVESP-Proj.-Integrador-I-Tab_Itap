const util = {
  hourToMinutes: (hourMinute) => {
      const [hour, minutes] = hourMinute.split(':');
      return parseInt(parseInt(hour) * 60 + parseInt(minutes));
  },
  minutesToHHMM: (minutes) => {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      const formattedMinutes = remainingMinutes < 10 ? `0${remainingMinutes}` : remainingMinutes;
      return `${hours}:${formattedMinutes}`;
  },
};

export default util;