"use client";

import { Box, Typography } from "@mui/material";
import { useDict } from "@/i18n/DictContext";

export default function Footer() {
  const { dict } = useDict();
  const year = new Date().getFullYear();
  return (
    <Box component="footer" className="section footer">
      <div className="container footer-inner">
        <Typography className="body-lg">{dict?.footer?.rights ?? "All rights reserved. · Ukraine, Kyiv"}</Typography>
        <Typography className="body-lg" sx={{ marginTop: "1vh" }}>{(dict?.footer?.copyright ?? "© {year} Webbie").replace('{year}', String(year))}</Typography>
      </div>
    </Box>
  );
}


