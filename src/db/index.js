import projectsInit from "../db/JsonData/projects.json";
import paymentsInit from "../db/JsonData/payments.json";
import appDataInit from "../db/JsonData/appData.json";
import contractmetadataInit from "../db/JsonData/contractMetadata.json";
const ge = typeof google != "undefined"; // Check if google.script.run is available

const FAKE_USER = {
  id: "fake_user",
  createdAt: "2024-10-03T13:55:51.772Z",
  modifiedAt: "2024-10-03T13:55:51.772Z",
  name: "Arnel",
  email: "fake_user@ceedcivil.com",
  password: "fake_user",
  role: "Admin",
  status: "Active",
  _rowIndex: 3,
};

function runScriptFunction(functionName, inputData = {}) {
  if (inputData) {
    inputData = {
      data: inputData,
      token: getTokenFromLocalStorage(),
    };
  } else {
    inputData = {
      token: getTokenFromLocalStorage(),
    };
  }

  console.log(
    `Google: running ${functionName} with data ${JSON.stringify(inputData)}`
  );

  return new Promise((resolve, reject) => {
    console.log(`ge:` + ge);
    if (ge) {
      google.script.run
        .withSuccessHandler((result) => {
          console.log(`Google Success: ${functionName} returned`, result);
          resolve(result);
        })
        .withFailureHandler((error) => {
          console.error(
            `Google Failure: ${functionName} encountered an error`,
            error
          );
          reject(error); // Pass the error to the calling function
        })
        [functionName](inputData);
    } else {
      return resolve(handleDevEnvironment(functionName, inputData));
    }
  });
}

function handleDevEnvironment(functionName, data) {
  switch (functionName) {
    case "login":
      return {
        user: FAKE_USER,
        token: "FAKE_TOKEN",
      };
    case "getSheetData":
      return {
        projects: projectsInit, // Fallback to local data if there's an error
        payments: paymentsInit,
      };
    case "getContractMetadata":
      return contractmetadataInit;
    case "createFbExpense":
      sleep(3000);
      return "fakeExpense";
    default:
      throw new Error(
        "Unhandled Fake Google Function " +
          functionName +
          ` ${Object.keys(data.data).length > 0 ? JSON.stringify(data) : ""}`
      );
  }
}

async function validateLogin(inputData) {
  // await sleep(30000);
  try {
    let { user, token } = await runScriptFunction("login", inputData);

    return { user, token };
  } catch (error) {
    console.error(error); //will be changed to throw error later
    const FAKE_USER = {
      id: "090a95ce-3933-4b57-a191-96dc067f9851",
      createdAt: "2024-10-03T13:55:51.772Z",
      modifiedAt: "2024-10-03T13:55:51.772Z",
      name: "Admin",
      email: "admin@ceedcivil.com",
      password: "password",
      role: "Admin",
      status: "Active",
      _rowIndex: 3,
    };

    if (inputData.token)
      return {
        user: FAKE_USER,
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjA5MGE5NWNlLTM5MzMtNGI1Ny1hMTkxLTk2ZGMwNjdmOTg1MSIsImNyZWF0ZWRBdCI6IjIwMjQtMTAtMDNUMTM6NTU6NTEuNzcyWiIsIm1vZGlmaWVkQXQiOiIyMDI0LTEwLTAzVDEzOjU1OjUxLjc3MloiLCJuYW1lIjoiQWRtaW4iLCJlbWFpbCI6ImFkbWluQGNlZWRjaXZpbC5jb20iLCJyb2xlIjoiQWRtaW4iLCJzdGF0dXMiOiJBY3RpdmUiLCJfcm93SW5kZXgiOjN9.yyF0FGeVa4bOVauiHdJmwvN4gHi1YYwhi1y/ZQP3khg=",
      };

    if (
      inputData.email === FAKE_USER.email &&
      inputData.password === FAKE_USER.password
    ) {
      return {
        user: FAKE_USER,
        msg: null,
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjA5MGE5NWNlLTM5MzMtNGI1Ny1hMTkxLTk2ZGMwNjdmOTg1MSIsImNyZWF0ZWRBdCI6IjIwMjQtMTAtMDNUMTM6NTU6NTEuNzcyWiIsIm1vZGlmaWVkQXQiOiIyMDI0LTEwLTAzVDEzOjU1OjUxLjc3MloiLCJuYW1lIjoiQWRtaW4iLCJlbWFpbCI6ImFkbWluQGNlZWRjaXZpbC5jb20iLCJyb2xlIjoiQWRtaW4iLCJzdGF0dXMiOiJBY3RpdmUiLCJfcm93SW5kZXgiOjN9.yyF0FGeVa4bOVauiHdJmwvN4gHi1YYwhi1y/ZQP3khg=",
      };
    } else {
      throw new Error("Wrong username or password");
    }
  }
}

function getappData() {
  if (ge) {
    const appDataElement = document.getElementById("app-data");
    if (appDataElement) {
      try {
        return JSON.parse(appDataElement.getAttribute("app-data"));
      } catch (error) {
        console.error("Error parsing app data:", error);
        return appDataInit;
      }
    }
  } else {
    console.log(`appDataInit:` + JSON.stringify(appDataInit));
    return appDataInit;
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function saveTokenInLocalStorage(token) {
  localStorage.setItem("ceedCivil_jwtToken", token);
}

function getTokenFromLocalStorage() {
  return localStorage.getItem("ceedCivil_jwtToken");
}

function trashToken() {
  localStorage.removeItem("ceedCivil_jwtToken");
}

export {
  saveTokenInLocalStorage,
  getTokenFromLocalStorage,
  validateLogin,
  trashToken,
  runScriptFunction,
  getappData,
  sleep,
};
