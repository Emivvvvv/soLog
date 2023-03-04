use anchor_lang::prelude::*;

pub mod constant;
pub mod states;
use crate::{constant::*, states::*};

declare_id!("HXc7keVUHXkwt86HpJKV88GfKYC94Cb4UeU3j5N5jvqs");

#[program]
pub mod solog {
    use super::*;

    pub fn init_user(ctx: Context<InitUser>, name: String, avatar: String) -> Result<()> {
        let user_account = &mut ctx.accounts.user_account;
        let authority = &mut ctx.accounts.authority;

        user_account.name = name;
        user_account.avatar = avatar;
        user_account.last_post_id = 0;
        user_account.post_count = 0;
        user_account.authority = authority.key();

        Ok(())
    }

    pub fn create_post(ctx: Context<CreatePost>, title: String, content: String, img: String) -> Result<()> {
        let post_account = &mut ctx.accounts.post_account;
        let user_account = &mut ctx.accounts.user_account;
        let authority = &mut ctx.accounts.authority;

        let clock = Clock::get()?;
        let current_timestamp: i64 = clock.unix_timestamp;
        let year: i64 = 1970 + (current_timestamp / 31536000) as i64;
        let month: i64 = (current_timestamp % 31536000) / 2678400;

        post_account.id = user_account.last_post_id;
        post_account.title = title;
        post_account.content = content;
        post_account.user = user_account.key();
        post_account.authority = authority.key();
        post_account.year = year;
        post_account.month = month;
        post_account.img = img;

        user_account.last_post_id = user_account.last_post_id.checked_add(1).unwrap();

        user_account.post_count = user_account.post_count.checked_add(1).unwrap();

        Ok(())
    }

    pub fn create_long_post(ctx: Context<CreateLongPost>, title: String, content: String, img: String) -> Result<()> {
        let long_post_account = &mut ctx.accounts.long_post_account;
        let user_account = &mut ctx.accounts.user_account;
        let authority = &mut ctx.accounts.authority;

        let clock = Clock::get()?;
        let current_timestamp: i64 = clock.unix_timestamp;
        let year: i64 = 1970 + (current_timestamp / 31536000) as i64;
        let month: i64 = (current_timestamp % 31536000) / 2678400;

        long_post_account.id = user_account.last_post_id;
        long_post_account.title = title;
        long_post_account.content = content;
        long_post_account.user = user_account.key();
        long_post_account.authority = authority.key();
        long_post_account.year = year;
        long_post_account.month = month;
        long_post_account.img = img;

        user_account.last_post_id = user_account.last_post_id.checked_add(1).unwrap();

        user_account.long_post_count = user_account.long_post_count.checked_add(1).unwrap();

        Ok(())
    }

    pub fn create_comment(ctx: Context<CreateComment>, comment: String, to_post: Pubkey) -> Result<()> {
        let comment_account = &mut ctx.accounts.comment_account;
        let user_account = &mut ctx.accounts.user_account;
        let authority = &mut ctx.accounts.authority;

        let clock = Clock::get()?;
        let current_timestamp: i64 = clock.unix_timestamp;
        let year: i64 = 1970 + (current_timestamp / 31536000) as i64;
        let month: i64 = (current_timestamp % 31536000) / 2678400;

        comment_account.comment = comment;
        comment_account.user = user_account.key();
        comment_account.authority = authority.key();
        comment_account.year = year;
        comment_account.month = month;
        comment_account.to_post = to_post;

        user_account.comment_count = user_account.comment_count.checked_add(1).unwrap();

        Ok(())
    }

    pub fn create_gif_comment(ctx: Context<CreateGifComment>, comment: String, gif: String, to_post: Pubkey) -> Result<()> {
        let gif_comment_account = &mut ctx.accounts.gif_comment_account;
        let user_account = &mut ctx.accounts.user_account;
        let authority = &mut ctx.accounts.authority;

        let clock = Clock::get()?;
        let current_timestamp: i64 = clock.unix_timestamp;
        let year: i64 = 1970 + (current_timestamp / 31536000) as i64;
        let month: i64 = (current_timestamp % 31536000) / 2678400;

        gif_comment_account.comment = comment;
        gif_comment_account.user = user_account.key();
        gif_comment_account.authority = authority.key();
        gif_comment_account.year = year;
        gif_comment_account.month = month;
        gif_comment_account.to_post = to_post;
        gif_comment_account.gif = gif;

        user_account.comment_count = user_account.comment_count.checked_add(1).unwrap();

        Ok(())
    }

    pub fn create_img_comment(ctx: Context<CreateImgComment>, comment: String, img: String, to_post: Pubkey) -> Result<()> {
        let img_comment_account = &mut ctx.accounts.img_comment_account;
        let user_account = &mut ctx.accounts.user_account;
        let authority = &mut ctx.accounts.authority;

        let clock = Clock::get()?;
        let current_timestamp: i64 = clock.unix_timestamp;
        let year: i64 = 1970 + (current_timestamp / 31536000) as i64;
        let month: i64 = (current_timestamp % 31536000) / 2678400;

        img_comment_account.comment = comment;
        img_comment_account.user = user_account.key();
        img_comment_account.authority = authority.key();
        img_comment_account.year = year;
        img_comment_account.month = month;
        img_comment_account.to_post = to_post;
        img_comment_account.img = img;

        user_account.comment_count = user_account.comment_count.checked_add(1).unwrap();

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction()]
pub struct InitUser<'info> {
    #[account(
    init,
    seeds = [USER_SEED, authority.key().as_ref()],
    bump,
    payer = authority,
    space = 2348 + 8
    )]
    pub user_account: Account<'info, UserAccount>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction()]
pub struct CreatePost<'info> {
    #[account(
    init,
    seeds = [POST_SEED, authority.key().as_ref(), &[user_account.last_post_id as u8].as_ref()],
    bump,
    payer = authority,
    space = 4441 + 8
    )]
    pub post_account: Account<'info, PostAccount>,

    #[account(mut, seeds = [USER_SEED, authority.key().as_ref()],
    bump,
    has_one = authority
    )]
    pub user_account: Account<'info, UserAccount>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction()]
pub struct CreateLongPost<'info> {
    #[account(
    init,
    seeds = [LONG_POST_SEED, authority.key().as_ref(), &[user_account.last_post_id as u8].as_ref()],
    bump,
    payer = authority,
    space = 22873 + 8
    )]
    pub long_post_account: Account<'info, LongPostAccount>,

    #[account(mut, seeds = [USER_SEED, authority.key().as_ref()],
    bump,
    has_one = authority
    )]
    pub user_account: Account<'info, UserAccount>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction()]
pub struct CreateComment<'info> {
    #[account(
    init,
    seeds = [COMMENT_SEED, authority.key().as_ref(), &[user_account.comment_count as u8].as_ref()],
    bump,
    payer = authority,
    space = 2164 + 8
    )]
    pub comment_account: Account<'info, CommentAccount>,

    #[account(mut, seeds = [USER_SEED, authority.key().as_ref()],
    bump,
    has_one = authority
    )]
    pub user_account: Account<'info, UserAccount>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction()]
pub struct CreateGifComment<'info> {
    #[account(
    init,
    seeds = [GIF_COMMENT_SEED, authority.key().as_ref(), &[user_account.comment_count as u8].as_ref()],
    bump,
    payer = authority,
    space = 4216 + 8
    )]
    pub gif_comment_account: Account<'info, GifCommentAccount>,

    #[account(mut, seeds = [USER_SEED, authority.key().as_ref()],
    bump,
    has_one = authority
    )]
    pub user_account: Account<'info, UserAccount>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction()]
pub struct CreateImgComment<'info> {
    #[account(
    init,
    seeds = [IMG_COMMENT_SEED, authority.key().as_ref(), &[user_account.comment_count as u8].as_ref()],
    bump,
    payer = authority,
    space = 4216 + 8
    )]
    pub img_comment_account: Account<'info, ImgCommentAccount>,

    #[account(mut, seeds = [USER_SEED, authority.key().as_ref()],
    bump,
    has_one = authority
    )]
    pub user_account: Account<'info, UserAccount>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}