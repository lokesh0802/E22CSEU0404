const express = require("express");
const { fetchNumbers } = require("./utils");
const { insertNewNumbers } = require("./logic_window_manger");
const app = express();
const PORT = 9876;

app.get("/numbers/:numberid", async (req, res) => {
  try {
    const numberid = req.params.numberid;
    const validIds = ['p', 'f', 'e', 'r'];

    if (!validIds.includes(numberid)) {
      return res.status(400).json({ error: "Invalid number ID. Use p, f, e, or r." });
    }
    const startTime = Date.now();
    const numbers = await fetchNumbers(numberid);
    if (Date.now() - startTime >= 500) {
      return res.status(504).json({ error: "Request timeout" });
    }

    const result = insertNewNumbers(numbers);
    res.json({
      windowPrevState: result.oldWindow,
      windowCurrState: result.currentWindow,
      numbers: result.newlyAdded,
      avg: result.average
    });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Average Calculator service running at http://localhost:${PORT}`);
});
