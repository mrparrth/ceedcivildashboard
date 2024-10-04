import projectsInit from "../db/JsonData/projects.json";
import paymentsInit from "../db/JsonData/payments.json";
import metadataInit from "../db/JsonData/metadata.json";

function saveTokenInLocalStorage(token) {
  localStorage.setItem("jwtToken", token);
}

function getTokenFromLocalStorage() {
  return localStorage.getItem("jwtToken");
}

function trashToken() {
  localStorage.removeItem("jwtToken");
}

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

  console.log(`running ${functionName} with data ${JSON.stringify(inputData)}`);
  return new Promise(function (resolve, reject) {
    google.script.run
      .withSuccessHandler(resolve)
      .withFailureHandler(reject)
      [functionName](inputData);
  });
}

async function getSheetData() {
  try {
    let data = await runScriptFunction("getSheetData");

    return {
      projects: data.projectData, // Use projects from Google Apps Script or fallback to initial
      payments: data.paymentsData,
      metadata: metadataInit, // Static metadata for now
    };
  } catch (error) {
    console.error("Error fetching projects:", error); //will be changed to throw error later

    return {
      projects: projectsInit, // Fallback to local data if there's an error
      metadata: metadataInit,
      payments: paymentsInit,
    };
  }
}

async function validateLogin(inputData) {
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

export {
  saveTokenInLocalStorage,
  getTokenFromLocalStorage,
  getSheetData,
  validateLogin,
  trashToken,
  runScriptFunction,
};
