const Network = importModule("Network");
const getReadings = Network.getReadings;
const renewAuthToken = Network.renewAuthToken;

const Util = importModule("Util");
const persistLocalData = Util.persistLocalData;
const parseLocalData = Util.parseLocalData;
const time = Util.getDateRange();

module.exports.fetchData = async () => {
    const currDateTime = new Date();
    const currDate = currDateTime.getDate();
    const currHour = currDateTime.getHours();
    const localData = parseLocalData("readings.json");

    try {
        let data = [];
        if (localData.length === 0 || currDate === 1) {
            data = await refetchData(time, currDateTime);
            return data;
        } else {
            const latest = localData.findLast(reading => reading.value !== 0);
            if (currDate > latest.date || currHour > latest.hour) {
                data = await refetchData(time, currDateTime);
                return data;
            } else {
                return localData;
            }
        }
    } catch (error) {
        Script.complete();
    }
};

async function refetchData(time, currDateTime) {
    await renewAuthToken();
    const readings = await getReadings(time.startDate, currDateTime);
    const data = setupData(time, readings);
    persistLocalData(data, "readings.json");
    return data;
}

function setupData(timeRange, readings) {
    const data = [];

    for (
        let i = timeRange.startDate.getDate();
        i <= timeRange.endDate.getDate();
        i++
    ) {
        data.push({ date: i, hour: 0, value: 0, costEstimate: 0 });
    }

    readings.forEach(reading => {
        const readingDateObj = new Date(Date.parse(reading.startAt));
        const index = readingDateObj.getDate() - 1;
        // - 1 because array index start from 0
        data[index].hour = readingDateObj.getHours();
        data[index].value += Number.parseFloat(reading.value);
        data[index].costEstimate += Number.parseFloat(reading.costEstimate);
    });

    return data;
}
