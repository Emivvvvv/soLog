use anchor_lang::prelude::*;

#[account]
#[derive(Default)]
pub struct UserAccount {
    pub name: String,        // 4 + 256
    pub avatar: String,      // 4 + 2048
    pub authority: Pubkey,   // 32
    pub last_post_id: u8,    // 1
    pub post_count: u8,      // 1
    pub long_post_count: u8, // 1
    pub comment_count: u8,   // 1
}

#[account]
#[derive(Default)]
pub struct PostAccount {
    pub id: u8,            // 1
    pub title: String,     // 4 + 256
    pub content: String,   // 4 + 2048
    pub year: i64,         // 8
    pub month: i64,        // 8
    pub img: String,       // 4 + 2048
    pub user: Pubkey,      // 32
    pub authority: Pubkey, // 32
}

#[account]
#[derive(Default)]
pub struct LongPostAccount {
    pub id: u8,            // 1
    pub title: String,     // 4 + 256
    pub content: String,   // 4 + 7500
    pub year: i64,         // 8
    pub month: i64,        // 8
    pub img: String,       // 4 + 2048
    pub user: Pubkey,      // 32
    pub authority: Pubkey, // 32
}

#[account]
#[derive(Default)]
pub struct CommentAccount {
    pub to_post: Pubkey,   // 32
    pub comment: String,   // 4 + 2048
    pub year: i64,         // 8
    pub month: i64,        // 8
    pub user: Pubkey,      // 32
    pub authority: Pubkey, // 32
}

#[account]
#[derive(Default)]
pub struct GifCommentAccount {
    pub to_post: Pubkey,   // 32
    pub comment: String,   // 4 + 2048
    pub gif: String,       // 4 + 2048
    pub year: i64,         // 8
    pub month: i64,        // 8
    pub user: Pubkey,      // 32
    pub authority: Pubkey, // 32
}

#[account]
#[derive(Default)]
pub struct ImgCommentAccount {
    pub to_post: Pubkey,   // 32
    pub comment: String,   // 4 + 2048
    pub img: String,       // 4 + 2048
    pub year: i64,         // 8
    pub month: i64,        // 8
    pub user: Pubkey,      // 32
    pub authority: Pubkey, // 32
}
