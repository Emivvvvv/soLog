import { PublicKey, SystemProgram } from "@solana/web3.js";
export async function getPostById(postId, program) {
  try {
    const post = await program.account.postAccount.fetch(new PublicKey(postId));
    const userId = post.user.toString();
    if (userId === SystemProgram.programId.toString()) {
      return;
    }
    return {
      id: postId,
      title: post.title,
      content: post.content,
      img: post.img,
      year: (post.year).toString(),
      month: (post.month).toString(),
      userIdToShow: userId,
      userId,
    };
  } catch (e) {
    try {
      const post = await program.account.longPostAccount.fetch(new PublicKey(postId));
      const userId = post.user.toString();
      if (userId === SystemProgram.programId.toString()) {
        return;
      }
      return {
        id: postId,
        title: post.title,
        content: post.content,
        img: post.img,
        year: (post.year).toString(),
        month: (post.month).toString(),
        userIdToShow: userId,
        userId,
      };
    } catch (e) {

      console.log(e.message);
    }
    console.log(e.message);
  }
}
