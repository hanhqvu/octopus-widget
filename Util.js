module.exports.errorAlertContext = {
    invalidField: {
        title: "Empty field",
        message: "Please enter all information and try again",
    },
    invalidUrl: {
        title: "Unable to complete",
        message:
            "Please try again later. If this continues, please contact the developer",
    },
    invalidLogin: {
        title: "Incorrect info",
        message: "Your username or password is incorrect. Please try again",
    },
    invalidData: {
        title: "No data",
        message:
            "We are unable to retrive the data. If this continues, please contact the developer",
    },
};

module.exports.persistLocalData = (data, name) => {
    const iFm = FileManager.iCloud();
    const dataString = JSON.stringify(data);
    iFm.writeString(`${iFm.documentsDirectory()}/${name}`, dataString);
};

module.exports.parseLocalData = name => {
    const iFm = FileManager.iCloud();
    const filePath = `${iFm.documentsDirectory()}/${name}`;
    if (!iFm.fileExists(filePath)) {
        return [];
    } else {
        const dataString = iFm.readString(`${filePath}`);
        const data = JSON.parse(dataString);
        return data;
    }
};

module.exports.getDateRange = () => {
    const today = new Date();
    const curYear = today.getFullYear();
    const curMonthIndex = today.getMonth();
    const startDate = new Date();
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);
    let endDate = new Date(curYear, curMonthIndex + 1, 0);
    return {
        startDate: startDate,
        endDate: endDate,
    };
};
