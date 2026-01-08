import { useEffect, useState } from "react";
import Nav from "../components/Nav"
import axios from "axios";
import colortheme from '../color/colortheme.json';

import './datasharing.css';

type ListEmailProps = {
    email: string;
    count: number;
}

type UserSensor = {
    sensor: string;
    count: number;
};

type UserChip = {
    chip: string;
    count: number;
};

type UserConnect = {
    connect: string;
    count: number;
};

type UserInfo = {
    timestamp: string;
    name: string;
    address: string;
    phone: string;
    email: string;
    objective: string;
    farmtype: string;
    suggest: string;
};

const default_userInfo: UserInfo = {
    timestamp: '',
    name: '',
    address: '',
    phone: '',
    email: '',
    objective: '',
    farmtype: '',
    suggest: ''
};

function Datasharing() {

    const [listEmail, setListEmail] = useState<ListEmailProps[]>([]);
    const [selectUser, setSelectUser] = useState<string>("overall");
    const [userInfo, setUserInfo] = useState<UserInfo>(default_userInfo);
    const [userTime, setUserTime] = useState<string>("");
    const [userSensor, setUserSensor] = useState<UserSensor[]>([]);
    const [userChip, setUserChip] = useState<UserChip[]>([]);
    const [userConnect, setUserConnect] = useState<UserConnect[]>([]);
    const [userCount, setUserCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [allUser, setAllUser] = useState<number>(0);
    const [allData, setAllData] = useState<number>(0);
    const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

    const GOOGLE_SHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID;
    const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
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

    const detailEmail = (email: string, sheetData: { values: string[][] }) => {
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
            "Timestamp", "Name", "Address", "Phone", "Email", "Objective", "Farm Type", "Suggest"
        ];
        const record: { [key: string]: string } = {};
        headers.forEach((_, i) => {
            record[headName[i]] = mostRecentRow[i] || "-";
        });
        record["Suggest"] = "-";

        const record_table = Object.entries(record).map(([key, value]) => ({
            Info: key,
            Detail: value
        }));

        return record_table;
    };

    function decimalToMacAddress(chipId: number) {
        const macAddress = [
            (chipId >> 16) & 0xFF,
            (chipId >> 8) & 0xFF,
            chipId & 0xFF,
            // 0x00, 0x00, 0x00 // Placeholder for missing bytes
        ]
            .map(byte => byte.toString(16).padStart(2, '0')) // Convert to hex format
            .join(':');
        return macAddress.toUpperCase();
    }

    const getDataSharing = async (email: string) => {
        try {
            const response = await axios.post(BFARM_DATASHARING_API, { email }, { timeout: 60000 });
            const data = response.data;
            const data_sensor = data.sensor;
            const data_sensor_n = data.sensor_count;
            const data_chip = data.chip;
            const data_chip_n = data.chip_count;
            const data_connect = data.connect;
            const data_connect_n = data.connectCounts;
            const data_time_start = data.minTimestamp;
            const data_time_stop = data.maxTimestamp;

            const record_sensor: { [key: string]: any } = {};
            const record_chip: { [key: string]: any } = {};
            const record_connect: { [key: string]: any } = {};
            // record["Document"] = data.document_count || "";
            data_sensor.forEach((sensor: string | number, i: string | number) => {
                record_sensor[sensor] = data_sensor_n[i] || "";
            });
            data_chip.forEach((chip: string | number, i: string | number) => {
                record_chip[chip] = data_chip_n[i] || "";
            });
            data_connect.forEach((connect: string | number, i: string | number) => {
                record_connect[connect] = data_connect_n[i] || "";
            });
            // data_chip.forEach((chip, i) => {
            //     record[`chip ${i}`] = `${chip} (${data_chip_n[i]})` || "";
            // });
            const record_sensor_sort = Object.entries(record_sensor).map(([key, value]) => ({
                sensor: key,
                count: value
            })).sort((a, b) => b.count - a.count);
            const record_chip_sort = Object.entries(record_chip).map(([key, value]) => ({
                chip: decimalToMacAddress(Number(key)),
                count: value
            })).sort((a, b) => b.count - a.count);
            const connect_meaning = {
                "N": "NETPIE",
                "A": "MAGELLAN",
                "T": "ThinkSpeak",
            }
            const record_connect_sort = Object.entries(record_connect).map(([key, value]) => ({
                connect: connect_meaning[key as keyof typeof connect_meaning],
                count: value
            })).sort((a, b) => b.count - a.count);

            // console.table(record_);

            return [record_sensor_sort, record_chip_sort, record_connect_sort, data_time_start, data_time_stop, data_time_stop - data_time_start];
        } catch (error) {
            console.error('Failed to fetch data from Bfarm API.', error);
            return null;
        }
    }


    const onClickUser = async (email: string | null) => {
        setLoading(true);
        if ((selectUser !== '' && selectUser !== 'overall') || (email !== 'overall')) {

            const response = await axios.get(SHEET_URL);
            const sheetData = response.data;

            const emailToFind = email ? email : selectUser; // Extract email from the selected option
            const results = detailEmail(emailToFind, sheetData);
            const results_datainfo = await getDataSharing(emailToFind);

            const durationMs = results_datainfo ? results_datainfo[5] ?? 0 : 0;

            // const seconds = Math.floor(durationMs / 1000) % 60;
            // const minutes = Math.floor(durationMs / (1000 * 60)) % 60;
            const hours = Math.floor(durationMs / (1000 * 60 * 60)) % 24;
            const days = Math.floor(durationMs / (1000 * 60 * 60 * 24));

            // const startActive = new Date(results_datainfo ? results_datainfo[3] : 0);
            // const endActive = new Date(results_datainfo ? results_datainfo[4] : 0);
            setUserTime(`${days} days, ${hours} hours`);
            setUserInfo({
                timestamp: results ? results[0].Detail : '',
                name: results ? results[1].Detail : '',
                address: results ? results[2].Detail : '',
                phone: results ? results[3].Detail : '',
                email: results ? results[4].Detail : '',
                objective: results ? results[5].Detail : '',
                farmtype: results ? results[6].Detail : '',
                suggest: results ? results[7].Detail : ''
            })
            setUserSensor(results_datainfo ? results_datainfo[0] : []);
            setUserChip(results_datainfo ? results_datainfo[1] : []);
            setUserConnect(results_datainfo ? results_datainfo[2] : []);
            setUserCount(listEmail.find(item => item.email === (email ? email : selectUser))?.count ?? 0)
        }
        setLoading(false);
    }
    const Text_h3 = (text: string) => {
        return <h3 style={{ color: isDarkMode ? colortheme.main.dark : colortheme.main.light }}>{text}</h3>;
    }
    const Text_h3_b = (text: string) => {
        return <h3 style={{ color: isDarkMode ? colortheme.main.dark : colortheme.main.light }}>{text}</h3>;
    }
    const Text_h4 = (text: string) => {
        return <h4 style={{ color: isDarkMode ? "white" : colortheme.text2.light }}>{text}</h4>;
    }

    useEffect(() => {
        const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDarkMode(isDarkMode);
        const fetchData = async () => {
            const fetchGetUser = await getUser();
            if (fetchGetUser) {
                const nameList = fetchGetUser[0];
                const countList = fetchGetUser[1];

                const emailMap = new Map<string, number>();

                nameList.forEach((email: string, index: number) => {
                    if (emailMap.has(email)) {
                        // รวม count ถ้าซ้ำ
                        emailMap.set(email, emailMap.get(email)! + Number(countList[index]));
                    } else {
                        emailMap.set(email, Number(countList[index]));
                    }
                });

                const uniqueEmails: ListEmailProps[] = Array.from(emailMap.entries()).map(([email, count]) => ({
                    email,
                    count,
                }));

                setListEmail(uniqueEmails);
                setAllUser(uniqueEmails.length);
                setAllData(uniqueEmails.reduce((acc, curr) => acc + curr.count, 0));
            }
        };
        fetchData();
    }, []);


    return (
        <div className="layout1" style={{ background: isDarkMode ? colortheme.background.dark : colortheme.background.light, minHeight: '100vh' }}>
            <Nav />
            <br />
            <h1 style={{ textAlign: 'center', color: isDarkMode ? colortheme.text1.dark : colortheme.text1.light }}>Data Sharing</h1>
            <br />
            <div className="layout2">

                <div style={{ display: 'flex', position: 'relative', width: '100%' }}>
                    <select className="select-nnt" onChange={(e) => {
                        setSelectUser(e.target.value);
                        onClickUser(e.target.value);
                    }} value={selectUser} style={{ background: isDarkMode ? "#444444" : "#ffffff", color: isDarkMode ? "#ffffff" : "#000000", border: isDarkMode ? "1px solid " + colortheme.main.dark : "1px solid " + colortheme.main.light }}>
                        {/* <option value="" hidden>Overall</option> */}
                        <option value="overall">Overall</option>
                        {listEmail.sort((a, b) => b.count - a.count).map((item, key) => (
                            <option key={key} value={item.email}>
                                {item.email} ({item.count.toLocaleString()} data)
                            </option>
                        ))}
                    </select>
                    <div style={{ padding: '0 6px' }}></div>
                    <button onClick={() => onClickUser(selectUser)} style={{ background: isDarkMode ? colortheme.main.dark + "aa" : colortheme.main.light }}>Search</button>
                    <div className="loader" style={{ display: loading ? '' : 'none' }}></div>
                </div>
                <div className="detailoverall" style={{ display: selectUser === "overall" ? '' : 'none', padding: '40px 0' }}>
                    {Text_h3(`Users sharing data: ${allUser.toLocaleString()} users.`)}
                    {Text_h3(`Total data in the database: ${allData.toLocaleString()} data.`)}
                </div>
                <div className="my-grid" style={{ display: selectUser !== "overall" ? '' : 'none' }}>
                    <div className="card-1" style={{ background: isDarkMode ? colortheme.backgroundcard.dark : colortheme.backgroundcard.light }}>
                        <div className="card-1-header">
                            {Text_h3("Sensor")}
                            {Text_h3(userSensor.length.toString())}
                        </div>
                        <div className="card-1-list">
                            {userSensor.map((item, index) => (
                                <div className="card-1-list-n" key={index}>
                                    {Text_h4(item.sensor)}
                                    {Text_h4(item.count.toLocaleString())}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="card-1" style={{ background: isDarkMode ? colortheme.backgroundcard.dark : colortheme.backgroundcard.light }}>
                        <div className="card-1-header">
                            {Text_h3("Chip")}
                            {Text_h3(userChip.length.toString())}
                        </div>
                        <div className="card-1-list">
                            {userChip.map((item, index) => (
                                <div className="card-1-list-n" key={index}>
                                    {Text_h4(item.chip)}
                                    {Text_h4(item.count.toLocaleString())}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="card-2" style={{ background: isDarkMode ? colortheme.backgroundcard.dark : colortheme.backgroundcard.light }}>
                        <div className="card-2-header">
                            {Text_h3("Connect")}
                        </div>
                        <div className="card-2-list">
                            {userConnect.map((item, index) => (
                                <div className="card-1-list-n" key={index}>
                                    {Text_h4(item.connect)}
                                    {Text_h4(item.count.toLocaleString())}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="card-2" style={{ background: isDarkMode ? colortheme.backgroundcard.dark : colortheme.backgroundcard.light }}>
                        <div className="card-2-header">
                            {Text_h3("Total Data")}
                        </div>
                        <div style={{ display: userSensor.length > 0 ? '' : 'none', width: '100%', textAlign: 'center' }}>
                            {Text_h3_b(userCount.toLocaleString() ?? "")}
                        </div>
                    </div>
                    <div className="card-3" style={{ background: isDarkMode ? colortheme.backgroundcard.dark : colortheme.backgroundcard.light }}>
                        <div className="card-3-header">
                            {Text_h3("User Info")}
                        </div>
                        <div className="card-3-list" style={{ display: userSensor.length > 0 ? '' : 'none' }}>
                            <div className="card-3-list-n">
                                {Text_h4("Name")}
                                {Text_h3_b(userInfo.name)}
                            </div>
                            <div className="card-3-list-n">
                                {Text_h4("Address")}
                                {Text_h3_b(userInfo.address)}
                            </div>
                            <div className="card-3-list-n">
                                {Text_h4("Phone")}
                                {Text_h3_b(userInfo.phone)}
                            </div>
                            <div className="card-3-list-n">
                                {Text_h4("Email")}
                                {Text_h3_b(userInfo.email)}
                            </div>
                            <div className="card-3-list-n">
                                {Text_h4("Objective")}
                                {Text_h3_b(userInfo.objective)}
                            </div>
                            <div className="card-3-list-n">
                                {Text_h4("Farm type")}
                                {Text_h3_b(userInfo.farmtype)}
                            </div>
                            <div className="card-3-list-n">
                                {Text_h4("Suggest")}
                                {Text_h3_b(userInfo.suggest)}
                            </div>
                            <div className="card-3-list-n">
                                {Text_h4("Duration")}
                                {Text_h3_b(userTime)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Datasharing