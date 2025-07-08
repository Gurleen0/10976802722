import React, { useState } from "react";
import { Container, Typography } from "@mui/material";
import URLShortenerList from "../components/URLShortenerList";
import { URLShortenerForm } from "../components/URLShortenerForm"; 


type Item = {
  original: string;
  shortcode: string;
  expiry: string;
};

const HomePage: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);

  const handleAdd = (item: Item) => {
    setItems((prev) => {
      const mappings = JSON.parse(localStorage.getItem("urlMappings") || "{}");
      mappings[item.shortcode] = {
        originalURL: item.original,
        created: new Date().toISOString(),
        expiry: item.expiry,
        clicks: mappings[item.shortcode]?.clicks || [],
      };
      localStorage.setItem("urlMappings", JSON.stringify(mappings));
      return [...prev, item];
    });
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>URL Shortener</Typography>
      <URLShortenerForm onAdd={handleAdd} />
      <URLShortenerList items={items} />
    </Container>
  );
};

export default HomePage;
