import express from "express";
const app = express();
const PORT = process.env.PORT || 4000;
app.use(express.json());
app.get("/", (req, res) => {
    res.send("Hello backend");
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map