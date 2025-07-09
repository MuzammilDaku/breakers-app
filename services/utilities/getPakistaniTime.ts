import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

export const getCurrentPakistaniTime = ()  => {
    return dayjs().tz('Asia/Karachi').format('YYYY-MM-DD HH:mm:ss');
};
