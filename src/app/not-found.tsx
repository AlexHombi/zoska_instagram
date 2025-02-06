
// src/app/not-found.tsx

import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container"

export const metadata = { title: `404 | ZoskaSnap` };

export default function NotFound() {
  
  return (
        <Container>
            <Typography> Nič také sa u nás nenachádza </Typography>
        </Container>
  );
}