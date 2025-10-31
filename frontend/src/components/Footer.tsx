"use client";

import { Box, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box component="footer" className="section footer">
      <div className="container footer-inner">
        <Typography className="body-lg">All rights reserved. · Ukraine, Kyiv</Typography>
        <Typography className="body-lg" sx={{ marginTop: "1vh" }}>© {new Date().getFullYear()} Webbie</Typography>
      </div>
    </Box>
  );
}


