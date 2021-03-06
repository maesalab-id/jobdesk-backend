const app = require('../app');
const moment = require('moment');

let sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

app.setup();

app.get('sequelizeSync').then(async () => {
    const messaging = app.get('fcm');
    let skipStart = false;
    let skipFinish = false;
    let lastMoment = moment();
    console.log('Notifier is running');
    while (true) {
        await sleep(5000);
        const now = moment();

        if (now.get('D') !== lastMoment.get('D')) {
            skipStart = false;
            skipFinish = false;
        }

        let schedule = (await app.service('schedules').find({
            query: {
                day: now.weekday(),
                $limit: 1
            }
        })).data[0];
        if (schedule) {
            const open = moment(schedule.open_time, [moment.ISO_8601, 'HH:mm:ss']);
            if (now.diff(open, 'minutes') >= 0) {
                if (!skipStart) {
                    const startMessage = {
                        notification: {
                            title: 'Waktu check-in sudah dekat',
                            body: `Segera lakukan check-in. Anda akan tercatat terlambat dalam ${schedule.tolerance} menit`
                        },
                        condition: `'unchecked' in topics`
                    }
                    try {
                        console.log('Sending open notification...', now);
                        const response = await messaging.send(startMessage);
                        skipStart = true;
                        console.log('Sent at ', moment(), response);
                    } catch (e) { console.log(e) };
                }
            }

            const close = moment(schedule.close_time, [moment.ISO_8601, 'HH:mm:ss']);
            if (now.diff(close, 'minutes') >= 0) {
                if (!skipFinish) {
                    const finishMessage = {
                        notification: {
                            title: 'Waktu check-out sudah dekat',
                            body: 'Jangan lupa lakukan check-out hari ini!'
                        },
                        condition: `'checked' in topics`
                    }
                    const absentMessage = {
                        notification: {
                            title: 'Waktu bekerja akan berakhir',
                            body: `Anda akan tercatat tidak hadir jika tidak segera check-in dalam ${schedule.tolerance} menit`
                        },
                        condition: `'unchecked' in topics`
                    }
                    try {
                        console.log('Sending close notification...', now);
                        const response = await messaging.send(finishMessage);
                        console.log('Sending absent notification...', now);
                        const response2 = await messaging.send(absentMessage);
                        skipFinish = true;
                        console.log('Sent (close) at ', moment(), response);
                        console.log('Sent (absent) at ', moment(), response2);
                    } catch (e) { console.log(e) };
                }
            }
        }
        lastMoment = now;
    }
});