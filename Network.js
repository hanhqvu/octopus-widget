const url = "https://api.oejp-kraken.energy/v1/graphql/";

module.exports.getReadings = async (start, end) => {
    const authToken = Keychain.get("AuthToken");
    if (!authToken) {
        throw Error("Invalid token");
    }
    const getReadingsRequest = new Request(url);
    getReadingsRequest.headers = {
        "content-type": "application/json",
        AUTHORIZATION: `${authToken}`,
    };
    getReadingsRequest.method = "POST";
    getReadingsRequest.body = JSON.stringify({
        query: `query halfHourlyReadings(
                $accountNumber: String!
                $fromDatetime: DateTime
                $toDatetime: DateTime
                $productCode: String!
            ) {
                account(accountNumber: $accountNumber) {
                    properties {
                        electricitySupplyPoints {
                            halfHourlyReadings(
                                fromDatetime: $fromDatetime
                                toDatetime: $toDatetime
                                productCode: $productCode
                            ) {
                                startAt
                                value
                                costEstimate
                            }
                        }
                    }
                }
            }`,
        variables: {
            accountNumber: Keychain.get("OctopusAccount"),
            fromDatetime: start,
            toDatetime: end,
            productCode: "JPN_STANDARD_OCTOPUS_JAN_22",
        },
    });
    response = await getReadingsRequest.loadJSON();
    if (response.data.detail) {
        throw new Error("Invalid URL");
    }
    if (response.data.errors) {
        if (response.data.errors[0].message === "Invalid data") {
            throw new Error("Invalid log-in info");
        }
        if (response.data.errors[0].message) {
            throw new Error("Invalid query");
        }
    }
    return response.data.account.properties[0].electricitySupplyPoints[0]
        .halfHourlyReadings;
};

module.exports.getTokens = async (email, password) => {
    if (email.length === 0 || password.length === 0) {
        throw Error("Invalid field");
    }
    const getTokensRequest = new Request(url);
    getTokensRequest.headers = { "content-type": "application/json" };
    getTokensRequest.method = "POST";
    getTokensRequest.body = JSON.stringify({
        query: `mutation login($input: ObtainJSONWebTokenInput!) {
          obtainKrakenToken(input: $input) {
            token
            refreshToken
          }
        }`,
        variables: {
            input: {
                email: email,
                password: password,
            },
        },
    });
    response = await getTokensRequest.loadJSON();
    if (response.data.detail) {
        throw new Error("Invalid URL");
    }
    if (response.data.errors) {
        if (response.data.errors[0].message === "Invalid data") {
            throw new Error("Invalid log-in info");
        }
        if (response.data.errors[0].message) {
            throw new Error("Invalid query");
        }
    }
    const { token, refreshToken } = response.data.obtainKrakenToken;
    Keychain.set("AuthToken", token);
    Keychain.set("RefreshToken", refreshToken);
};

module.exports.renewAuthToken = async () => {
    const refreshToken = Keychain.get("RefreshToken");
    if (!refreshToken) throw Error("Invalid refresh token");
    const renewAuthTokenRequest = new Request(url);
    renewAuthTokenRequest.headers = { "content-type": "application/json" };
    renewAuthTokenRequest.method = "POST";
    renewAuthTokenRequest.body = JSON.stringify({
        query: `mutation login($input: ObtainJSONWebTokenInput!) {
        obtainKrakenToken(input: $input) {
          token
        }
      }`,
        variables: {
            input: {
                refreshToken: refreshToken,
            },
        },
    });
    response = await renewAuthTokenRequest.loadJSON();
    if (response.data.detail) {
        throw new Error("Invalid URL");
    }
    if (response.data.errors) {
        if (response.data.errors[0].message === "Invalid data") {
            throw new Error("Invalid log-in info");
        }
        if (response.data.errors[0].message) {
            throw new Error("Invalid query");
        }
    }
    const { token } = response.data.obtainKrakenToken;
    Keychain.set("AuthToken", token);
};