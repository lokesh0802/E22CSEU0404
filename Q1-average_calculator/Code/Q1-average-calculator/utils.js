const axios = require('axios');
const baseUrl = "http://20.244.56.144/evaluation-service";
const urlMap = {
  p: "primes",
  f: "fibo",
  e: "even",
  r: "rand"
};

async function fetchNumbers(type) {
  if (typeof type !== 'string') {
    throw new Error("Type must be a string");
  }
  
  const endpoint = urlMap[type];
  if (!endpoint) {
    throw new Error("Invalid number type");
  }

  try {
    const response = await axios.get(`${baseUrl}/${endpoint}`, { timeout: 500 });
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    } else if (response.data && Array.isArray(response.data.numbers)) {
      return response.data.numbers;
    }
    return [];
  } catch (err) {
    console.error(`Error fetching numbers: ${err.message}`);
    return [];
  }
}
module.exports = { fetchNumbers };
