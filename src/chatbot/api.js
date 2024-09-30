const BASE_URL = "https://api-utility-02885d450e64.herokuapp.com/microplan";

const fetchData = async (endpoint, params = [], subpath = "") => {
  const url = `${BASE_URL}/${endpoint}${
    params.length > 0 ? "/" + params.map(encodeURIComponent).join("/") : ""
  }${subpath ? "/" + subpath : ""}`;

  console.log(" request url = ", url);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetching data failed:", error);
    return { error: error.message };
  }
};

// Example usages:
export const fetchLgas = () => fetchData("lgas");
export const fetchWards = (lga_name) => fetchData("lga", [lga_name]);
export const fetchHc = (ward_name) => fetchData("lga/ward", [ward_name]);
export const fetchSettlement = (hc_name) =>
  fetchData("lga/ward/hospital", [hc_name], "settlements");
export const fetchPopulation = (hc_name, settlement_name) =>
  fetchData(
    "lga/ward/hospital",
    [hc_name],
    `settlement/${settlement_name}/population`
  );
export const fetchProfile = (hc_name, settlement_name) =>
  fetchData(
    "lga/ward/hospital",
    [hc_name],
    `settlement/${settlement_name}/profile`
  );
export const fetchFamilyPlanning = (hc_name, settlement_name) =>
  fetchData(
    "lga/ward/hospital",
    [hc_name],
    `settlement/${settlement_name}/family`
  );
export const fetchImmunization = (hc_name, settlement_name) =>
  fetchData(
    "lga/ward/hospital",
    [hc_name],
    `settlement/${settlement_name}/immunization`
  );
export const fetchMalaria = (hc_name, settlement_name) =>
  fetchData(
    "lga/ward/hospital",
    [hc_name],
    `settlement/${settlement_name}/malaria`
  );
export const fetchConsumables = (hc_name, settlement_name) =>
  fetchData(
    "lga/ward/hospital",
    [hc_name],
    `settlement/${settlement_name}/consumables`
  );
export const fetchHfTools = (hc_name, settlement_name) =>
  fetchData(
    "lga/ward/hospital",
    [hc_name],
    `settlement/${settlement_name}/hftools`
  );

export const answerQuestion = async (question) => {
  try {
    const response = await fetch(
      `https://rmnchn-rag-43d8c7e61bc1.herokuapp.com/chatbot?user_input=${encodeURIComponent(
        question
      )}`
    );

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error sending question: ", error);
    return { error: error.message };
  }
};
