import { useState, useEffect, Suspense, useRef } from "react";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { Post } from "@prisma/client";
import { Badge, Button, TextareaAutosize } from "@mui/material";
import Card from "@mui/material/Card";
import CommentIcon from "@mui/icons-material/Comment";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { trpcReact } from "@/trpc/trpcReact";
import { add, formatDistance, set } from "date-fns";
import { on } from "events";

export default function PostsPreview({
  post,
}: {
  post: Post & { _count: { comments: number } };
}) {
  const [commentsVisible, setCommentsVisible] = useState(false);
  return (
    <Card>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {post.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {post.content}
        </Typography>
      </CardContent>

      <Grid
        alignItems={"end"}
        alignContent={"flex-end"}
        justifyContent={"flex-end"}
        justifySelf={"end"}
        alignSelf={"end"}
        flexGrow={1}
      >
        {post._count?.comments ? (
          <IconButton color="secondary" aria-label="view comments">
            <Badge
              color="secondary"
              badgeContent={post._count?.comments}
              onClick={() => {
                setCommentsVisible(!commentsVisible);
              }}
            >
              <CommentIcon />
            </Badge>
          </IconButton>
        ) : null}
      </Grid>
      <Grid alignItems={"start"} flexGrow={1}>
        {commentsVisible ? (
          <Suspense fallback="loading comments...">
            <PostComments id={post.id} />
          </Suspense>
        ) : null}
      </Grid>
    </Card>
  );
}

const PostComments = ({ id }: { id: number }) => {
  const [newComment, setNewComment] = useState("");

  const addComment = trpcReact.addComment.useMutation();
  const comments = trpcReact.getComments.useQuery({ id });
  const textRef = useRef(null);
  return (
    <Card>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Comments
        </Typography>
        <Grid spacing={3} paddingBottom={4}>
          <TextareaAutosize
            ref={textRef}
            aria-label="minimum height"
            placeholder="Minimum 3 rows"
            style={{
              width: "100%",
              fontSize: ".9rem",
              padding: 4,
              minHeight: 48,
            }}
            onChange={(e) => {
              console.log(e.target.value);
              setNewComment(e.target.value);
            }}
          />
          <Button
            variant="contained"
            color="primary"
            disabled={!newComment.length}
            onClick={() => {
              addComment.mutate(
                {
                  postId: id,
                  content: newComment,
                },
                {
                  onSuccess: () => {
                    setNewComment("");
                    textRef.current.value = "";
                    comments.refetch();
                  },
                }
              );
            }}
          >
            Post Comment
          </Button>
        </Grid>
        <Typography variant="body2" color="text.secondary">
          <Grid spacing={3}>
            {comments.data?.map((comment) => (
              <Grid marginBottom={2} key={comment.id}>
                <Typography>{comment.content}</Typography>
                <Typography variant="caption">
                  {formatDistance(new Date(comment.createdAt), new Date(), {
                    addSuffix: true,
                  })}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Typography>
      </CardContent>
    </Card>
  );
};
