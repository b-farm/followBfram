import axios from 'axios';
import chalk from 'chalk';
import inquirer from 'inquirer';
import 'dotenv/config';

const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

const SHEET_URL = `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEET_ID}/values/Form%20Responses%201!A:G?key=${GOOGLE_API_KEY}`;
const BFARM_DATASHARING_API = "https://bfarm-api.noip.in.th/datasharing";

const getUser = async () => {
    try {
        const response = await axios.get(BFARM_DATASHARING_API);
        const data = response.data;
        const data_name = data.name;
        const data_countdoc = data.countdoc;

        return [data_name, data_countdoc];
    } catch (error) {
        console.error('Failed to fetch data from Bfarm API.', error);
        return null;
    }
}

const detailEmail = (email, sheetData) => {
    const rows = sheetData.values;
    const headers = rows[0];
    const emailIndex = headers.indexOf("Email");
    const timestampIndex = headers.indexOf("Timestamp");

    if (emailIndex === -1 || timestampIndex === -1) {
        console.error("Required columns not found.");
        return null;
    }

    // Filter rows that match the email
    const matchedRows = rows.slice(1).filter(row => row[emailIndex] === email);

    if (matchedRows.length === 0) return null;

    // Find the most recent row based on timestamp
    const mostRecentRow = matchedRows.reduce((latest, current) => {
        const latestDate = new Date(latest[timestampIndex]);
        const currentDate = new Date(current[timestampIndex]);
        return currentDate > latestDate ? current : latest;
    });

    // Convert row to object with headers
    const headName = [
        "Timestamp", "Name", "Address", "Phone", "Email", "Objective", "Farm Type"
    ];
    const record = {};
    headers.forEach((_, i) => {
        record[headName[i]] = mostRecentRow[i] || "";
    });

    const record_table = Object.entries(record).map(([key, value]) => ({
        Info: key,
        Detail: value
    }));

    return record_table;
};

function decimalToMacAddress(chipId) {
    const macAddress = [
        (chipId >> 16) & 0xFF,
        (chipId >> 8) & 0xFF,
        chipId & 0xFF,
        0x00, 0x00, 0x00 // Placeholder for missing bytes
    ]
        .map(byte => byte.toString(16).padStart(2, '0')) // Convert to hex format
        .join(':');
    return macAddress.toUpperCase();
}

const getDataSharing = async (email) => {
    try {
        const response = await axios.post(BFARM_DATASHARING_API, { email });
        const data = response.data;
        const data_sensor = data.sensor;
        const data_sensor_n = data.sensor_count;
        const data_chip = data.chip;
        const data_chip_n = data.chip_count;
        const data_connect = data.connect;
        const data_connect_n = data.connectCounts;
        const data_time_start = data.minTimestamp;
        const data_time_stop = data.maxTimestamp;

        const record_sensor = {};
        const record_chip = {};
        const record_connect = {};
        // record["Document"] = data.document_count || "";
        data_sensor.forEach((sensor, i) => {
            record_sensor[sensor] = data_sensor_n[i] || "";
        });
        data_chip.forEach((chip, i) => {
            record_chip[chip] = data_chip_n[i] || "";
        });
        data_connect.forEach((connect, i) => {
            record_connect[connect] = data_connect_n[i] || "";
        });
        // data_chip.forEach((chip, i) => {
        //     record[`chip ${i}`] = `${chip} (${data_chip_n[i]})` || "";
        // });
        const record_sensor_sort = Object.entries(record_sensor).map(([key, value]) => ({
            sensor: key,
            count: value
        })).sort((b, a) => a.count - b.count);
        const record_chip_sort = Object.entries(record_chip).map(([key, value]) => ({
            chip: decimalToMacAddress(key),
            count: value
        })).sort((b, a) => a.count - b.count);
        const connect_meaning = {
            "N": "NETPIE",
            "A": "MAGELLAN",
            "T": "ThinkSpeak",
        }
        const record_connect_sort = Object.entries(record_connect).map(([key, value]) => ({
            connect: connect_meaning[key],
            count: value
        })).sort((b, a) => a.value - b.value);

        // console.table(record_);

        return [record_sensor_sort, record_chip_sort, record_connect_sort, data_time_start, data_time_stop, data_time_stop - data_time_start];
    } catch (error) {
        console.error('Failed to fetch data from Bfarm API.', error);
        return null;
    }
}

const waitForKey = () => {
    return new Promise((resolve) => {
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.setEncoding('utf8');

        const onData = (key) => {
            if (key === '\u000D') { // Enter
                // process.stdin.setRawMode(false);
                process.stdin.pause();
                process.stdin.removeListener('data', onData);
                resolve('continue');
            } else if (key === '\u001B') { // ESC
                // process.stdin.setRawMode(false);
                process.stdin.pause();
                process.stdin.removeListener('data', onData);
                resolve('exit');
            }
        };

        process.stdin.on('data', onData);
    });
};

async function main() {
    while (true) {
        try {
            const user = await getUser();
            const selectEmail = await inquirer.prompt(
                [
                    {
                        type: 'list',
                        name: 'User',
                        message: `Select Email (Bfarm Data Sharing)`,
                        choices: user[0]
                            .map((info, i) => ({ email: info, count: user[1][i] }))
                            .sort((a, b) => b.count - a.count)
                            .map(({ email, count }) => `${email} (${count})`)

                    }
                ]);
            const response = await axios.get(SHEET_URL);
            const sheetData = response.data;

            const emailToFind = selectEmail.User.split(' ')[0]; // Extract email from the selected option
            const results = detailEmail(emailToFind, sheetData);
            const results_datainfo = await getDataSharing(emailToFind);

            const durationMs = results_datainfo[5] ?? 0;

            const seconds = Math.floor(durationMs / 1000) % 60;
            const minutes = Math.floor(durationMs / (1000 * 60)) % 60;
            const hours = Math.floor(durationMs / (1000 * 60 * 60)) % 24;
            const days = Math.floor(durationMs / (1000 * 60 * 60 * 24));

        } catch (error) {
            console.error('Failed to fetch data from Google Sheets.', error);
        }

        const action = await waitForKey();
        if (action === 'exit') {
            console.log('Exiting...');
            break;
        }

        console.clear();
    }
}

const userTime = async () => {
    const response = await axios.get(SHEET_URL);
    const sheetData = response.data;
    const saveTime = new Set();
    const countDate = [];
    sheetData.values.map((data) => {
        const readDate = data[0].split(" ")[0];
        if(!saveTime.has(readDate)) {
            saveTime.add(readDate);
            countDate.push({date: readDate, count: 1});
        } else {
            const dateEntry = countDate.find(entry => entry.date === readDate);
            if (dateEntry) {
                dateEntry.count++;
            }
        }
    });
    console.table(countDate); // show all items, not truncated
};

userTime();