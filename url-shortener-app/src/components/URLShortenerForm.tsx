import React, { useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Alert,
  Card,
  CardContent,
} from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import { useLogger } from "../context/LoggerContext";
import { isValidURL, isAlphanumeric, isValidValidity } from "../utils/validators";

export const URLShortenerForm: React.FC = () => {
  const [url, setUrl] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [validity, setValidity] = useState("");
  const [error, setError] = useState("");
  const { logEvent } = useLogger();

  const handleSubmit = () => {
    setError("");

    if (!isValidURL(url)) return setError("Please enter a valid URL.");
    if (customCode && !isAlphanumeric(customCode))
      return setError("Custom shortcode must be alphanumeric.");
    if (validity && !isValidValidity(validity))
      return setError("Validity must be a positive number (in minutes).");

    const mappings = JSON.parse(localStorage.getItem("urlMappings") || "{}");
    const shortcode = customCode || uuidv4().slice(0, 6);

    if (mappings[shortcode])
      return setError("Shortcode already exists. Use another one or leave blank.");

    const now = new Date();
    const expiry = new Date(now.getTime() + (parseInt(validity) || 30) * 60000);

    mappings[shortcode] = {
      originalURL: url,
      created: now.toISOString(),
      expiry: expiry.toISOString(),
      clicks: [],
    };

    localStorage.setItem("urlMappings", JSON.stringify(mappings));
    logEvent("Shortened URL created", { shortcode, url, expiry });

    // Clear inputs
    setUrl("");
    setCustomCode("");
    setValidity("");
  };

  return (
    <Card elevation={4} sx={{ borderRadius: 3, p: 2, maxWidth: 700, margin: "auto", mt: 4 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          🔗 Create a Shortened URL
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Original URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/your-link"
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Custom Code (optional)"
              value={customCode}
              onChange={(e) => setCustomCode(e.target.value)}
              placeholder="e.g. mylink123"
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Validity (minutes)"
              value={validity}
              onChange={(e) => setValidity(e.target.value)}
              placeholder="e.g. 30"
              variant="outlined"
            />
          </Grid>

          {error && (
            <Grid item xs={12}>
              <Alert severity="error">{error}</Alert>
            </Grid>
          )}

          <Grid item xs={12}>
            <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>
              Shorten URL
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
