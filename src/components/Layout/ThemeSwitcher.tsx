"use client";
import themes from "@/data/themes.json";

import { ChangeEvent } from "react";

export default function ThemeSwitcher() {
  function handleChange(e: ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value || "";
    if (value && document.documentElement) {
      document.documentElement.setAttribute("data-theme", value);
    }
  }

  return (
    <select
      className="select select-bordered w-full max-w-xs"
      onChange={(e) => handleChange(e)}
    >
      <option disabled selected>
        change theme
      </option>
      {themes.map((t) => {
        return (
          <option key={t} value={t}>
            {t}
          </option>
        );
      })}
    </select>
  );
}
