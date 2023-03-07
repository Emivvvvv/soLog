import * as anchor from '@project-serum/anchor'
import { useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react'
import { PublicKey, SystemProgram } from "@solana/web3.js";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";
import { getAvatarUrl } from "src/functions/getAvatarUrl";
import { getRandomName } from "src/functions/getRandomName";
import idl from "src/idl.json";
import { findProgramAddressSync } from '@project-serum/anchor/dist/cjs/utils/pubkey'
import { utf8 } from '@project-serum/anchor/dist/cjs/utils/bytes'

const PROGRAM_KEY = new PublicKey(idl.metadata.address);

const BlogContext = createContext();

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error("Parent must be wrapped inside PostsProvider");
  }

  return context;
};

export const BlogProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [initialized, setInitialized] = useState(false);
  const [posts, setPosts] = useState([])
  const [longPosts, setLongPosts] = useState([])
  const [transactionPending, setTransactionPending] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [showModalComment, setShowModalComment] = useState(false)
  const [lastPostId, setLastPostId] = useState(0)
  const [lastCommentId, setLastCommentId] = useState(0)
  const [comments, setComments] = useState([])
  const [gifComments, setGifComments] = useState([])
  const [imgComments, setImgComments] = useState([])
    const [showModalGifComment,setShowModalGifComment] = useState(false)
    const [showModalImgComment,setShowModalImgComment] = useState(false)

  const anchorWallet = useAnchorWallet();
  const { connection } = useConnection();
  const { publicKey } = useWallet()

  const program = useMemo(() => {
    if (anchorWallet) {
      const provider = new anchor.AnchorProvider(connection, anchorWallet, anchor.AnchorProvider.defaultOptions())
      return new anchor.Program(idl, PROGRAM_KEY, provider)
    }
  }, [connection, anchorWallet])

  useEffect(() => {

    const start = async () => {
      if (program && publicKey) {
        try {
          const [userPda] = await findProgramAddressSync([utf8.encode('user'), publicKey.toBuffer()], program.programId)
          const user = await program.account.userAccount.fetch(userPda)
            console.log(user);
          if (user) {
            setInitialized(true)
            setUser(user)
            setLastPostId(user.lastPostId)
            setLastCommentId(user.commentCount)
            const postAccounts = await program.account.postAccount.all(publicKey.toString())
            const longPostAccounts = await program.account.longPostAccount.all(publicKey.toString())
            const commentAccounts = await program.account.commentAccount.all(publicKey.toString())
            const gifCommentAccounts  = await program.account.gifCommentAccount.all(publicKey.toString())
            const imgCommentAccounts = await program.account.imgCommentAccount.all(publicKey.toString())
            setPosts(postAccounts)
            setLongPosts(longPostAccounts)
            setComments(commentAccounts)
            setGifComments(gifCommentAccounts)
            setImgComments(imgCommentAccounts)
          }
        } catch (error) {
          console.log(error)
          setInitialized(false)
        }
      }
    }

    start()

  }, [program, publicKey, transactionPending]);


  const initUser = async () => {
    if (program && publicKey) {
      try {
        setTransactionPending(true)
        const [userPda] = findProgramAddressSync([utf8.encode('user'), publicKey.toBuffer()], program.programId)
        const name = getRandomName();
        const avatar = getAvatarUrl(name);

        await program.methods
          .initUser(name, avatar)
          .accounts({
            userAccount: userPda,
            authority: publicKey,
            systemProgram: SystemProgram.programId,
          })
          .rpc()
        setInitialized(true)
      } catch (error) {
        console.log(error)
      } finally {
        setTransactionPending(false)
      }
    }
  }

  const createPost = async (title, img, content) => {
    if (program && publicKey) {
      setTransactionPending(true)
      try {
        const [userPda] = findProgramAddressSync([utf8.encode('user'), publicKey.toBuffer()], program.programId)
        const [longPostPda] = findProgramAddressSync([utf8.encode('long_post'), publicKey.toBuffer()], program.programId)
        const [postPda] = findProgramAddressSync([utf8.encode('post'), publicKey.toBuffer(), Uint8Array.from([lastPostId])], program.programId)
        const [commentPda] = findProgramAddressSync([utf8.encode('comment'), publicKey.toBuffer(), Uint8Array.from([lastCommentId])], program.programId)
        const [gifCommentPda] = findProgramAddressSync([utf8.encode('gif_comment'), publicKey.toBuffer(), Uint8Array.from([lastCommentId])], program.programId)
        const [imgCommentAccount] = findProgramAddressSync([utf8.encode('img_comment'), publicKey.toBuffer(), Uint8Array.from([lastCommentId])], program.programId)

        if (content.length > 2047) {
          await program.methods
              .createLongPost(title, content, img)
              .accounts({
                userAccount: userPda,
                postAccount: postPda,
                longPostAccount: longPostPda,
                commentAccount: commentPda,
                gifCommentAccount: gifCommentPda,
                imgCommentAccount: imgCommentAccount,
                authority: publicKey,
                systemProgram: SystemProgram.programId,
              })
              .rpc()
        } else {
        await program.methods
          .createPost(title, content, img)
          .accounts({
            userAccount: userPda,
            postAccount: postPda,
            longPostAccount: longPostPda,
            commentAccount: commentPda,
            gifCommentAccount: gifCommentPda,
            imgCommentAccount: imgCommentAccount,
            authority: publicKey,
            systemProgram: SystemProgram.programId,
          })
          .rpc()}

        setShowModal(false)
        setShowModalComment(false)
      } catch (error) {
        console.error(error)
      } finally {
        setTransactionPending(false)
      }
    }
  }

  const createComment = async (comment, toPost) => {
    if (program && publicKey) {
      setTransactionPending(true)
      try {
          const toPostKey = new PublicKey(toPost);
          const [userPda] = findProgramAddressSync([utf8.encode('user'), publicKey.toBuffer()], program.programId)
          const [commentPda] = findProgramAddressSync([utf8.encode('comment'), publicKey.toBuffer(), Uint8Array.from([lastCommentId])], program.programId)

              await program.methods
                  .createComment(comment, toPostKey)
                  .accounts({
                      userAccount: userPda,
                      commentAccount: commentPda,
                      authority: publicKey,
                      systemProgram: SystemProgram.programId,
                  })
                  .rpc()

        setShowModal(false)
        setShowModalComment(false)
      } catch (error) {
          console.log("1")
        console.error(error)
          console.log("2")
      } finally {
        setTransactionPending(false)
      }
    }
  }

    const createImgComment = async (comment, img, toPost) => {
        if (program && publicKey) {
            setTransactionPending(true)
            try {
                const [userPda] = findProgramAddressSync([utf8.encode('user'), publicKey.toBuffer()], program.programId)
                const [imgCommentAccount] = findProgramAddressSync([utf8.encode('img_comment'), publicKey.toBuffer(), Uint8Array.from([lastCommentId])], program.programId)
                const toPostKey = new PublicKey(toPost);
                await program.methods
                    .createImgComment(comment, img, toPostKey)
                    .accounts({
                        userAccount: userPda,
                        imgCommentAccount: imgCommentAccount,
                        authority: publicKey,
                        systemProgram: SystemProgram.programId,
                    })
                    .rpc()

                setShowModal(false)
                setShowModalImgComment(false)
            } catch (error) {
                console.error(error)
            } finally {
                setTransactionPending(false)
            }
        }
    }

    const createGifComment = async (comment, gif, toPost) => {
        if (program && publicKey) {
            setTransactionPending(true)
            try {
                const [userPda] = findProgramAddressSync([utf8.encode('user'), publicKey.toBuffer()], program.programId)
                const [gifCommentPda] = findProgramAddressSync([utf8.encode('gif_comment'), publicKey.toBuffer(), Uint8Array.from([lastCommentId])], program.programId)
                const toPostKey = new PublicKey(toPost);

                    await program.methods
                        .createGifComment(comment, gif, toPostKey)
                        .accounts({
                            userAccount: userPda,
                            gifCommentAccount: gifCommentPda,
                            authority: publicKey,
                            systemProgram: SystemProgram.programId,
                        })
                        .rpc()


                setShowModal(false)
                setShowModalGifComment(false)
            } catch (error) {
                console.log("zort")
                console.error(error)
                console.log("tiri")
            } finally {
                setTransactionPending(false)
            }
        }
    }



  return (
    <BlogContext.Provider
      value={{
        user,
        posts,
        longPosts,
        initialized,
        initUser,
        createPost,
        showModal,
        setShowModal,
        setShowModalComment,
        showModalComment,
          createComment,
          createGifComment,
          createImgComment,
        comments,
        gifComments,
        imgComments,
          showModalGifComment,setShowModalGifComment,showModalImgComment,setShowModalImgComment,
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};
