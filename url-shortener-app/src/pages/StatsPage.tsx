import React, { useEffect, useState } from "react";
import { Container, Typography, Card, CardContent } from "@mui/material";

type Entry = {
  shortcode: string;
  originalURL: string;
  created: string;
  expiry: string;
  clicks: any[];
};

const StatsPage: React.FC = () => {
  const [data, setData] = useState<Entry[]>([]);

  useEffect(() => {
    const mappings = JSON.parse(localStorage.getItem("urlMappings") || "{}");
    const items = Object.entries(mappings).map(([shortcode, val]: any) => ({
      shortcode,
      ...val,
    }));
    setData(items);
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>URL Stats</Typography>
      {data.map((item) => (
        <Card key={item.shortcode} sx={{ mb: 2 }}>
          <CardContent>
            <Typography><strong>Short URL:</strong> {`${window.location.origin}/${item.shortcode}`}</Typography>
            <Typography><strong>Original:</strong> {item.originalURL}</Typography>
            <Typography><strong>Created:</strong> {new Date(item.created).toLocaleString()}</Typography>
            <Typography><strong>Expires:</strong> {new Date(item.expiry).toLocaleString()}</Typography>
            <Typography><strong>Total Clicks:</strong> {item.clicks?.length || 0}</Typography>
            {item.clicks?.map((click, idx) => (
              <Typography variant="body2" key={idx}>
                {click.timestamp} • {click.source} • {click.location}
              </Typography>
            ))}
          </CardContent>
        </Card>
      ))}
    </Container>
  );
};

export default StatsPage;
