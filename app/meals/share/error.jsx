"use client";

import React from "react";

export default function Error({ error }) {
  return (
    <main className="error">
      <h1>An error occured</h1>
      <p>Failed to create meal.</p>
    </main>
  );
}
