const Network = importModule("Network");
const getTokens = Network.getTokens;

const Util = importModule("Util");
const errorAlertContext = Util.errorAlertContext;

authSuccessAlert = new Alert();
authSuccessAlert.title = "Success";
authSuccessAlert.message = "Credentials are securely saved to Keychain";
authSuccessAlert.addCancelAction("Dismiss");

userPrompt = new Alert();
userPrompt.title = "Please provide your username and password";
userPrompt.addTextField("Account Number", "");
userPrompt.addTextField("Email", "");
userPrompt.addSecureTextField("Password", "");
userPrompt.addCancelAction("Cancel");
userPrompt.addAction("Submit");

if ((await userPrompt.present()) !== -1) {
    Keychain.set("OctopusAccount", userPrompt.textFieldValue(0));
    const email = userPrompt.textFieldValue(1);
    const password = userPrompt.textFieldValue(2);
    try {
        await getTokens(email, password);
        authSuccessAlert.present();
    } catch (error) {
        errorAlert = new Alert();
        errorAlert.addCancelAction("Dismiss");
        switch (error.message) {
            case "Invalid URL":
                errorAlert.title = errorAlertContext.invalidUrl.title;
                errorAlert.message = errorAlertContext.invalidUrl.message;
            case "Invalid log-in info":
                errorAlert.title = errorAlertContext.invalidLogin.title;
                errorAlert.message = errorAlertContext.invalidLogin.message;
            case "Invalid query":
                errorAlert.title = errorAlertContext.invalidData.title;
                errorAlert.message = errorAlertContext.invalidData.message;
            case "Invalid field":
                errorAlert.title = errorAlertContext.invalidField.title;
                errorAlert.message = errorAlertContext.invalidField.message;
        }
        errorAlert.present();
    }
}
