import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const RedirectHandler: React.FC = () => {
  const { shortcode } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const mappings = JSON.parse(localStorage.getItem("urlMappings") || "{}");
    const entry = mappings[shortcode!];
    if (!entry) return navigate("/");

    if (new Date() > new Date(entry.expiry)) {
      alert("Link expired");
      return navigate("/");
    }

    entry.clicks = entry.clicks || [];
    entry.clicks.push({
      timestamp: new Date().toISOString(),
      source: document.referrer || "direct",
      location: "N/A",
    });
    localStorage.setItem("urlMappings", JSON.stringify(mappings));
    window.location.href = entry.originalURL;
  }, []);

  return <Typography>Redirecting...</Typography>;
};

export default RedirectHandler;
