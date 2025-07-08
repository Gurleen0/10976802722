import React, { useState } from "react";
import { TextField, Button, Grid, Alert } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import { isValidURL, isAlphanumeric, isValidValidity } from "../utils/validators";
import { useLogger } from "../context/LoggerContext";

interface Row {
  url: string;
  validity: string;
  shortcode: string;
  error?: string;
}

type Props = {
  onAdd: (row: Row & { shortcode: string; expiry: string }) => void;
};

const URLShortenerForm: React.FC<Props> = ({ onAdd }) => {
  const [rows, setRows] = useState<Row[]>([
    { url: "", validity: "", shortcode: "" },
  ]);
  const { logEvent } = useLogger();

  const addRow = () =>
    setRows((r) => (r.length < 5 ? [...r, { url: "", validity: "", shortcode: "" }] : r));

  const updateRow = (i: number, field: keyof Row, value: string) =>
    setRows((r) => r.map((row, idx) => (idx === i ? { ...row, [field]: value } : row)));

  const handleSubmit = () => {
    rows.forEach((row, i) => {
      let err = "";
      if (!isValidURL(row.url)) err = "Invalid URL";
      else if (row.shortcode && !isAlphanumeric(row.shortcode)) err = "Invalid shortcode";
      else if (row.validity && !isValidValidity(row.validity)) err = "Invalid minutes";

      if (err) {
        updateRow(i, "error", err);
        logEvent("Validation failed", { rowIndex: i, error: err });
      } else {
        const sc = row.shortcode || uuidv4().slice(0, 6);
        const now = new Date();
        const expiry = new Date(
          now.getTime() + 60000 * (row.validity ? parseInt(row.validity) : 30)
        ).toISOString();
        onAdd({ ...row, shortcode: sc, expiry });
        logEvent("Shortened URL", { original: row.url, shortcode: sc, expiry });
      }
    });
  };

  return (
    <Grid container spacing={2}>
      {rows.map((row, i) => (
        <React.Fragment key={i}>
          {row.error && (
            <Grid item xs={12}>
              <Alert severity="error">{row.error}</Alert>
            </Grid>
          )}
          <Grid item xs={4}>
            <TextField label="Long URL" fullWidth value={row.url} onChange={(e) => updateRow(i, "url", e.target.value)} />
          </Grid>
          <Grid item xs={3}>
            <TextField label="Validity (min)" fullWidth value={row.validity} onChange={(e) => updateRow(i, "validity", e.target.value)} />
          </Grid>
          <Grid item xs={3}>
            <TextField label="Custom Shortcode" fullWidth value={row.shortcode} onChange={(e) => updateRow(i, "shortcode", e.target.value)} />
          </Grid>
          {i === rows.length - 1 && rows.length < 5 && (
            <Grid item xs={2}>
              <Button variant="outlined" fullWidth onClick={addRow}>+ Add Row</Button>
            </Grid>
          )}
        </React.Fragment>
      ))}
      <Grid item xs={12}>
        <Button variant="contained" onClick={handleSubmit}>Shorten URLs</Button>
      </Grid>
    </Grid>
  );
};

export default URLShortenerForm;
