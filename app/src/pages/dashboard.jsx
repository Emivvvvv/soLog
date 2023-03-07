import { useWallet } from "@solana/wallet-adapter-react"
import { PhantomWalletName } from "@solana/wallet-adapter-wallets"
import { useEffect, useState } from "react"
import { Button } from "src/components/Button"
import { PostForm } from "src/components/PostForm"
import { PostCommentForm } from "src/components/PostCommentForm"
import { PostGifCommentForm } from "src/components/PostGifCommentForm"
import { PostImgCommentForm } from "src/components/PostImgCommentForm"
import { useBlog } from "src/context/Blog"
import { useHistory } from 'react-router-dom'



export const Dashboard = () => {
  const history = useHistory()
  const [connecting, setConnecting] = useState(false)
  const { connected, select } = useWallet()
  const { user, longPosts, posts, initialized, initUser, createComment, createGifComment, createImgComment, createPost,showModalGifComment,setShowModalGifComment,showModalImgComment,setShowModalImgComment, showModalComment, setShowModalComment, showModal, setShowModal, comments, gifComments, imgComments } = useBlog()
  const [postTitle, setPostTitle] = useState("")
  const [postContent, setPostContent] = useState("")
  const [postImg, setPostImg] = useState("")
  const [commentContent, setCommentContent] = useState("")
  const [toPost, setToPost] = useState("")
  const [commentImg, setCommentImg] = useState("")
  const [commentGif, setCommentGif] = useState("")

  const onConnect = () => {
    setConnecting(true)
    select(PhantomWalletName)
  }

  useEffect(() => {
    if (user) {
      setConnecting(false)
    }
  }, [user])

  return (
      <div className="dashboard lred overflow-auto h-screen">
        <header className="fixed z-10 w-full h-14  shadow-md">
          <div className="flex justify-between items-center h-full container">
            <h2 className="text-2xl font-bold">
              <div className="bg-clip-text bg-gradient-to-br from-indigo-300 colorred"
              >
                soLog
              </div>
            </h2>
            {connected ? (
                <div className="flex items-center">
                  <img
                      src={user?.avatar}
                      alt="avatar"
                      className="w-8 h-8 rounded-full bg-gray-200 shadow ring-2 ring-indigo-400 ring-offset-2 ring-opacity-50"
                  />
                  <p className=" font-bold text-sm ml-2 capitalize">
                    {user?.name}
                  </p>
                  {initialized ? (
                      <Button
                          className="ml-3 mr-2"
                          onClick={() => {
                            setShowModal(true)
                          }}
                      >
                        Create Post
                      </Button>
                  ) : (
                      <Button
                          className="ml-3 mr-2"
                          onClick={() => {
                            initUser()
                          }}
                      >
                        Initialize User
                      </Button>
                  )}

                </div>
            ) : (
                <Button
                    loading={connecting}
                    className="w-28"
                    onClick={onConnect}
                    leftIcon={
                      <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                      >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                    }
                >
                  Connect
                </Button>
            )}
          </div>
        </header>
        <main className="dashboard-main pb-4 container flex relative">
          <div className="pt-3">
            <h1 className="title">My Posts</h1>
            <div className="row">
              <div className="all__posts">
                {posts.map((item) => {
                  return (
                      <article className="post__card-2"
                               onClick={() => {
                                 history.push(`/read-post/${item.publicKey.toString()}`)
                               }}
                               key={item.account.id}
                      >
                        <div className="post__card_-2">
                          <div
                              className="post__card__image-2"
                              style={{
                                backgroundImage: `url(${item.account.img})`,
                              }}
                          ></div>
                          <div>
                            <div className="post__card_meta-2">
                              <div className="post__card_cat"><span className="dot"> </span>{item.account.title} </div>
                              <p className="post__card_alttitle-2">
                                {item.account.content}
                              </p>
                            </div>
                          </div>
                        </div>
                      </article>
                  )
                })}
                {longPosts.map((item) => {
                  return (
                      <article className="post__card-2"
                               onClick={() => {
                                 history.push(`/read-post/${item.publicKey.toString()}`)
                               }}
                               key={item.account.id}
                      >
                        <div className="post__card_-2">
                          <div
                              className="post__card__image-2"
                              style={{
                                backgroundImage: `url(${item.account.img})`,
                              }}
                          ></div>
                          <div>
                            <div className="post__card_meta-2">
                              <div className="post__card_cat"><span className="dot"> </span>{item.account.title} </div>
                              <p className="post__card_alttitle-2">
                                {item.account.content}
                              </p>
                            </div>
                          </div>
                        </div>
                      </article>
                  )
                })}
                {comments.map((item) => {
                  return (

                      <article>
                        <p>From: {item.account.user.toString()} to post: {item.account.toPost.toString()}</p>
                        <p>Comment: {item.account.comment}</p>
                      </article>
                  )
                })}
                {gifComments.map((item) => {
                  return (
                      <article>
                        <p>From: {item.account.user.toString()} to post: {item.account.toPost.toString()}</p>
                        <p>Comment: {item.account.comment}</p>
                        gif:
                        <div
                            className="post__card__image-2"
                            style={{
                              backgroundImage: `url(${item.account.gif})`,
                            }}
                        ></div>
                      </article>
                  )
                })}
                {imgComments.map((item) => {
                  return (
                      <article>
                        <p>From: {item.account.user.toString()} to post: {item.account.toPost.toString()}</p>
                        <p>Comment: {item.account.comment}</p>
                        img:
                        <div
                            className="post__card__image-2"
                            style={{
                              backgroundImage: `url(${item.account.img})`,
                            }}
                        ></div>
                      </article>
                  )
                })}
                <Button
                    className="ml-3 mr-2"
                    onClick={() => {
                      setShowModalComment(true);
                    }}
                >
                  Create Comment
                </Button>
                <Button
                    className="ml-3 mr-2"
                    onClick={() => {
                      setShowModalGifComment(true);
                    }}
                >
                  Create Gif Comment
                </Button>
                <Button
                    className="ml-3 mr-2"
                    onClick={() => {
                      setShowModalImgComment(true);
                    }}
                >
                  Create Img Comment
                </Button>
              </div>
            </div>
          </div>
          <div className={`modal ${showModal && 'show-modal'}`} >
            <div className="modal-content">
            <span className="close-button"
                  onClick={() => setShowModal(false)}
            >×</span>
              <PostForm
                  postTitle={postTitle}
                  postContent={postContent}
                  postImg={postImg}
                  setPostTitle={setPostTitle}
                  setPostImg={setPostImg}
                  setPostContent={setPostContent}
                  onSubmit={() => createPost(postTitle, postImg, postContent)}
              />
            </div>
          </div>

          <div className={`modal ${showModalComment && 'show-modal'}`} >
            <div className="modal-content">
            <span className="close-button"
                  onClick={() => setShowModalComment(false)}
            >×</span>
              <PostCommentForm
                  commentContent={commentContent}
                  setCommentContent={setCommentContent}
                  toPost={toPost}
                  setToPost={setToPost}
                  onSubmit={() => createComment(commentContent, toPost)}
              />
            </div>
          </div>

          <div className={`modal ${showModalGifComment && 'show-modal'}`} >
            <div className="modal-content">
            <span className="close-button"
                  onClick={() => setShowModalGifComment(false)}
            >×</span>
              <PostGifCommentForm
                  commentContent={commentContent}
                  setCommentContent={setCommentContent}
                  toPost={toPost}
                  setToPost={setToPost}
                  commentGif={commentGif}
                  setCommentGif={setCommentGif}
                  onSubmit={() => createGifComment(commentContent, commentGif, toPost)}
              />
            </div>
          </div>

          <div className={`modal ${showModalImgComment && 'show-modal'}`} >
            <div className="modal-content">
            <span className="close-button"
                  onClick={() => setShowModalImgComment(false)}
            >×</span>
              <PostImgCommentForm
                  commentContent={commentContent}
                  setCommentContent={setCommentContent}
                  toPost={toPost}
                  setToPost={setToPost}
                  commentImg={commentImg}
                  setCommentImg={setCommentImg}
                  onSubmit={() => createImgComment(commentContent, commentImg, toPost)}
              />
            </div>
          </div>

        </main>
      </div>
  )
}
