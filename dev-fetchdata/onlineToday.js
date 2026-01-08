import axios from 'axios';

async function getTodayTimes() {
    const response = await axios.get('https://bfarm-api.noip.in.th/macid');
    const data = response.data;

    // Get today's date in YYYY-MM-DD format
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayStr = `${yyyy}-${mm}-${dd}`;

    // Filter records where time is today
    const timesToday = data
        .filter(item => item.time.startsWith(todayStr))
        .map(item => item.time);
    
    return timesToday;
}

getTodayTimes().then(times => {
    console.log('Times for today:', times);
}).catch(err => {
    console.error('Error:', err);
});