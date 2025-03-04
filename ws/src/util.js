const moment = require('moment');
const _ = require('lodash');

module.exports = {
    SLOT_DURATION: 60, // MINUTOS

    isOpened: (horarios) => {
        if (!Array.isArray(horarios)) {
            return false;
        }

        const horariosDia = horarios.filter((h) => h.dias.includes(moment().day()));
        if (horariosDia.length > 0) {
            for (let h of horariosDia) {
                const inicio = moment(h.inicio, 'HH:mm');
                const fim = moment(h.fim, 'HH:mm');
                if (moment().isBetween(inicio, fim)) {
                    return true;
                }
            }
            return false;
        }
        return false;
    },

    toCents: (price) => {
        return parseInt(price.toString().replace('.', '').replace(',', ''));
    },

    hourToMinutes: (hourMinute) => {
        if (!hourMinute || typeof hourMinute !== 'string') {
            throw new Error('Formato de hora inválido. Esperado: "HH:mm"');
        }
        const [hour, minutes] = hourMinute.split(':');
        return parseInt(hour) * 60 + parseInt(minutes);
    },

    sliceMinutes: (start, end, duration, validation = true) => {
        const slices = [];
        const now = moment();

        // Verificar se start e end são objetos moment válidos
        if (!moment.isMoment(start) || !moment.isMoment(end)) {
            throw new Error('Os parâmetros start e end devem ser objetos moment válidos.');
        }

        while (end > start) {
            if (start.format('YYYY-MM-DD') === now.format('YYYY-MM-DD') && validation) {
                if (start.isAfter(now)) {
                    slices.push(start.format('HH:mm'));
                }
            } else {
                slices.push(start.format('HH:mm'));
            }

            start = start.add(duration, 'minutes');
        }
        return slices;
    },

    mergeDateTime: (date, time) => {
        if (!moment.isMoment(date) || !moment.isMoment(time)) {
            throw new Error('Os parâmetros date e time devem ser objetos moment válidos.');
        }
        return moment(`${date.format('YYYY-MM-DD')}T${time.format('HH:mm')}`);
    },

    splitByValue: (array, value) => {
        let newArray = [[]];
        array.forEach((item) => {
            if (item !== value) {
                newArray[newArray.length - 1].push(item);
            } else {
                newArray.push([]);
            }
        });
        return newArray;
    },

    // Funções adicionais
    minutesToHHMM: (minutes) => {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        const formattedMinutes = remainingMinutes < 10 ? `0${remainingMinutes}` : remainingMinutes;
        return `${hours}:${formattedMinutes}`;
    },

    diffHours: (start, end) => {
        const startTime = moment(start, 'HH:mm');
        const endTime = moment(end, 'HH:mm');
        return endTime.diff(startTime, 'minutes');
    },

    generateTimeSlots: (start, end, duration, interval) => {
        const slots = [];
        let currentTime = moment(start, 'HH:mm');
        const endTime = moment(end, 'HH:mm');

        while (currentTime.isSameOrBefore(endTime)) {
            slots.push(currentTime.format('HH:mm'));
            currentTime.add(interval, 'minutes');
        }
        return slots;
    },

    isTimeSlotAvailable: (time, timeSlots) => {
        return timeSlots.includes(time);
    },

    formatPhoneNumber: (phoneNumber) => {
        const cleaned = ('' + phoneNumber).replace(/\D/g, '');
        const match = cleaned.match(/^(\d{2})(\d{4})(\d{4})$/);
        if (match) {
            return `(${match[1]}) ${match[2]}-${match[3]}`;
        }
        return phoneNumber;
    },

    randomBetween: (min, max) => {
        return Math.floor(Math.random() * (max - min + 1) + min);
    },

    sortBy: (array, property, order = 'asc') => {
        const sortedArray = [...array];
        sortedArray.sort((a, b) => {
            const aValue = a[property];
            const bValue = b[property];

            if (order === 'asc') {
                return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
            } else {
                return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
            }
        });
        return sortedArray;
    },

    removeDuplicates: (array) => {
        return _.uniq(array);
    },
};