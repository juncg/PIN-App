import { CommentCard } from './comment-card';

export default {
  title: 'Cards/CommentCard',
  component: CommentCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

const mockUser = {
  id: '1',
  name: 'John',
  surnames: 'Doe',
  username: 'johndoe',
  profile_picture: '/placeholder.png',
};

const mockComment: any = {
  id: 1,
  text: 'This is a sample comment with some text to show how it looks.',
  created_at: new Date().toISOString(),
  creator_id: '1',
  forum_id: null,
  likes: 5,
  superlikes: 1,
  comment_locked_state: 'Unlocked',
  state: 'Posted',
  user: mockUser,
  replies: [],
  replyCount: 2,
};

const mockCommentWithReply: any = {
  ...mockComment,
  replies: [
    {
      id: 2,
      text: 'This is a reply to the comment.',
      created_at: new Date(Date.now() - 3600000).toISOString(),
      creator_id: '2',
      forum_id: null,
      likes: 1,
      superlikes: 0,
      comment_locked_state: 'Unlocked',
      state: 'Posted',
      user: {
        id: '2',
        name: 'Jane',
        surnames: 'Smith',
        username: 'janesmith',
        profile_picture: '/placeholder.png',
      },
      replies: [],
      replyCount: 0,
    },
  ],
};

export const Default = {
  args: {
    comment: mockComment,
    postId: 1,
    currentUser: mockUser,
  },
};

export const WithReplies = {
  args: {
    comment: mockCommentWithReply,
    postId: 1,
    currentUser: mockUser,
  },
};

export const NestedReply = {
  args: {
    comment: mockCommentWithReply.replies[0],
    level: 1,
    postId: 1,
    currentUser: mockUser,
    parentComment: mockComment,
  },
};