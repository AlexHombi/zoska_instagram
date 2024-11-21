
// src/app/profil/[profilId]/page.tsx

import Typography from "@mui/material/Typography";

export const metadata = { title: `Detail profilu | ZoskaSnap` };

export default function ProfileDetail({ params }: { params: { profilId: string }}) {
  
  return (

      <Typography> Detail profilu { params.profilId }</Typography>

  );
}