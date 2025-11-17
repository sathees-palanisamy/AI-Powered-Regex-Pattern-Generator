// server.js - Add this at the very top
require('dotenv').config();

const express = require("express");
const app = express();
const regexGraph = require("./graph/regexGraph");

app.use(express.json());

app.post("/generate-pattern", async (req, res) => {
  try {
    const { description, samples } = req.body;

    // Validate input
    if (!description || !samples) {
      return res.status(400).json({ 
        error: "Missing required fields: description and samples" 
      });
    }

    console.log('Received request:', { description, samples });

    // Use the invoke method on the compiled graph
    const result = await regexGraph.invoke({
      description: description || "",
      samples: samples || [],
      rulesJson: "",
      resultJson: ""
    });

    console.log('Graph result:', result);

    let rules = [];
    let output = {};
    try { 
      rules = JSON.parse(result.rulesJson); 
    } catch (e) {
      console.error('Error parsing rulesJson:', e);
    }
    try { 
      output = JSON.parse(result.resultJson); 
    } catch (e) {
      console.error('Error parsing resultJson:', e);
    }

    res.json({ 
      success: true,
      rules: rules.rules || rules,
      output 
    });

  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ 
      error: err.message,
      details: "Check console for more information" 
    });
  }
});

app.listen(3000, () => console.log("API running on port 3000"));