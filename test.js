import axios from "axios";

async function test() {
  try {
    const res = await axios.post("http://localhost:3000/ai/run", {
      prompt: "build a clean login API in node"
    });

    console.log("SUCCESS:");
    console.log(JSON.stringify(res.data, null, 2));

  } catch (err) {
    console.log("FAILED REQUEST:");
    console.log("STATUS:", err.response?.status);
    console.log("DATA:", JSON.stringify(err.response?.data, null, 2));
    console.log("MESSAGE:", err.message);
  }
}

test();