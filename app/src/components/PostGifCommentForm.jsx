import { FC, ReactNode, useState } from "react";
import { Button } from "src/components/Button";
import { useBlog } from "src/context/Blog";

export const PostGifCommentForm = (props) => {
  const { user } = useBlog();
  const {
    onSubmit,
    commentContent,
    setCommentContent,
      commentGif,
      setCommentGif,
      toPost,
      setToPost,
    formHeader,
    buttonText = "Post",
  } = props;
  const [loading, setLoading] = useState(false);

  return (
    <div className="rounded-lg py-4 px-6 bg- flex flex-col ">
      {formHeader}
      <textarea
        value={commentContent}
        onChange={(e) => setCommentContent(e.target.value)}
        name="content"
        id="content-area"
        rows={3}
        placeholder="Type your comment..."
        className="bg-white rounded-xl px-4 py-2 mt-3 black"
      ></textarea>
        <input
            value={commentGif}
            onChange={(e) => setCommentGif(e.target.value)}
            type="text"
            placeholder="comment gif"
            className="bg-white rounded-3xl h-10 px-4 black"
        />
        <input
            value={toPost}
            onChange={(e) => setToPost(e.target.value)}
            type="text"
            placeholder="to post public key"
            className="bg-white rounded-3xl h-10 px-4 black"
        />
      <Button
        className="mt-3"
        disabled={!user}
        loading={loading}
        onClick={async () => {
          setLoading(true);
          await onSubmit();
          setLoading(false);
        }}
      >
        {buttonText}
      </Button>
    </div>
  );
};
