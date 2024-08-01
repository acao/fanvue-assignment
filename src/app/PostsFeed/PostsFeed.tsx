import { trpcReact } from "@/trpc/trpcReact";
import PostsPreview from "./components/PostPreview";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { Stack } from "@mui/material";

export const PostsFeed = () => {
  const { data } = trpcReact.getPosts.useQuery();
  return (
    <Stack spacing={3}>
      {data?.posts
        .filter((post) => post.published)
        .map((post) => (
          <PostsPreview post={post} key={post.id} />
        ))}
    </Stack>
  );
};
