"use client";

import { Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { PostsFeed } from "./PostsFeed/PostsFeed";

export default function Home() {
  // example query...
  // const { data } = trpcReact.getPosts.useQuery();

  return (
    <main>
      <Grid container  spacing={3} justifyContent="center" >
        <Typography justifySelf="start" padding={3} md={6} variant="h4" component={"h1"} gridRow={"auto"}>
          Posts
        </Typography>
      </Grid>

      <Grid container justifyContent="center">
        <Grid md={6}>
          <PostsFeed />
        </Grid>
      </Grid>
    </main>
  );
}
