import axios from "axios";

export async function Log(
  stack: "backend" | "frontend",
  level: "debug" | "info" | "warn" | "error" | "fatal",
  pkg:
    | "cache"
    | "controller"
    | "cron_job"
    | "db"
    | "domain"
    | "handler"
    | "repository"
    | "route"
    | "service"
    | "auth"
    | "config"
    | "middleware"
    | "utils"
    | "api"
    | "component"
    | "hook"
    | "page"
    | "state"
    | "style",
  message: string
) {
  try {
    const response = await axios.post(
      "http://20.244.56.144/evaluation-service/logs",
      {
        stack,
        level,
        package: pkg,
        message,
      },
      {
        headers: {
          Authorization: "YOUR_TOKEN_HERE",
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Log sent:", response.data);
  } catch (err: any) {
    console.error("Logging failed:", err.response?.data || err.message);
  }
}
