
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from "@/components/ui/use-toast";
import {
  MessageSquare,
  Send,
  MoreVertical,
  Clock,
  ThumbsUp,
  Reply,
  Flag,
  Trash2,
  Edit2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from 'date-fns';

interface CommentUser {
  id: string;
  name: string;
  avatar?: string;
  role: string;
}

interface ProjectComment {
  id: string;
  content: string;
  user: CommentUser;
  createdAt: string;
  updatedAt?: string;
  likes: number;
  isLiked: boolean;
  replies: ProjectComment[];
  isEdited: boolean;
}

interface ProjectCommentsProps {
  comments: ProjectComment[];
  currentUser: CommentUser;
  isAdmin: boolean;
  onCreateComment: (content: string, parentId?: string) => Promise<void>;
  onUpdateComment: (commentId: string, content: string) => Promise<void>;
  onDeleteComment: (commentId: string) => Promise<void>;
  onLikeComment: (commentId: string) => Promise<void>;
  onReportComment: (commentId: string) => Promise<void>;
}

const ProjectComments: React.FC<ProjectCommentsProps> = ({
  comments,
  currentUser,
  isAdmin,
  onCreateComment,
  onUpdateComment,
  onDeleteComment,
  onLikeComment,
  onReportComment
}) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const handleCreateComment = async (parentId?: string) => {
    if (!newComment.trim()) return;

    setIsProcessing(true);
    try {
      await onCreateComment(newComment.trim(), parentId);
      setNewComment('');
      setReplyingTo(null);
      toast({
        title: "Success",
        description: "Comment added successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdateComment = async (commentId: string) => {
    if (!editContent.trim()) return;

    setIsProcessing(true);
    try {
      await onUpdateComment(commentId, editContent.trim());
      setEditingComment(null);
      setEditContent('');
      toast({
        title: "Success",
        description: "Comment updated successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update comment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    setIsProcessing(true);
    try {
      await onDeleteComment(commentId);
      toast({
        title: "Success",
        description: "Comment deleted successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete comment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    setIsProcessing(true);
    try {
      await onLikeComment(commentId);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to like comment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReportComment = async (commentId: string) => {
    setIsProcessing(true);
    try {
      await onReportComment(commentId);
      toast({
        title: "Success",
        description: "Comment reported successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to report comment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  const renderComment = (comment: ProjectComment, isReply = false) => {
    const isEditing = editingComment === comment.id;
    const isReplying = replyingTo === comment.id;

    return (
      <div key={comment.id} className={`space-y-4 ${isReply ? 'ml-12' : ''}`}>
        <div className="flex gap-4">
          <Avatar>
            <AvatarImage src={comment.user.avatar} />
            <AvatarFallback>{getInitials(comment.user.name)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{comment.user.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {comment.user.role}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </span>
                  {comment.isEdited && (
                    <span className="text-gray-400">(edited)</span>
                  )}
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {(currentUser.id === comment.user.id || isAdmin) && (
                    <>
                      <DropdownMenuItem
                        onClick={() => {
                          setEditingComment(comment.id);
                          setEditContent(comment.content);
                        }}
                        disabled={isProcessing}
                      >
                        <Edit2 className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteComment(comment.id)}
                        disabled={isProcessing}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem
                    onClick={() => setReplyingTo(comment.id)}
                    disabled={isProcessing}
                  >
                    <Reply className="h-4 w-4 mr-2" />
                    Reply
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleReportComment(comment.id)}
                    disabled={isProcessing}
                  >
                    <Flag className="h-4 w-4 mr-2" />
                    Report
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {isEditing ? (
              <div className="space-y-2">
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  placeholder="Edit your comment"
                  rows={3}
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditingComment(null);
                      setEditContent('');
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => handleUpdateComment(comment.id)}
                    disabled={isProcessing || !editContent.trim()}
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-gray-700">{comment.content}</p>
            )}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleLikeComment(comment.id)}
                disabled={isProcessing}
                className={comment.isLiked ? 'text-blue-600' : ''}
              >
                <ThumbsUp className="h-4 w-4 mr-2" />
                {comment.likes}
              </Button>
              {!isReply && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setReplyingTo(comment.id)}
                  disabled={isProcessing}
                >
                  <Reply className="h-4 w-4 mr-2" />
                  Reply
                </Button>
              )}
            </div>
            {isReplying && (
              <div className="space-y-2">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a reply..."
                  rows={3}
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setReplyingTo(null);
                      setNewComment('');
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => handleCreateComment(comment.id)}
                    disabled={isProcessing || !newComment.trim()}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Reply
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
        {comment.replies.length > 0 && (
          <div className="space-y-4">
            {comment.replies.map((reply) => renderComment(reply, true))}
          </div>
        )}
      </div>
    );
  };

  const handleCreateComment = async (parentId?: string) => {
    if (!newComment.trim()) return;

    setIsProcessing(true);
    try {
      await onCreateComment(newComment.trim(), parentId);
      setNewComment('');
      setReplyingTo(null);
      toast({
        title: "Success",
        description: "Comment added successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdateComment = async (commentId: string) => {
    if (!editContent.trim()) return;

    setIsProcessing(true);
    try {
      await onUpdateComment(commentId, editContent.trim());
      setEditingComment(null);
      setEditContent('');
      toast({
        title: "Success",
        description: "Comment updated successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update comment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    setIsProcessing(true);
    try {
      await onDeleteComment(commentId);
      toast({
        title: "Success",
        description: "Comment deleted successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete comment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    setIsProcessing(true);
    try {
      await onLikeComment(commentId);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to like comment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReportComment = async (commentId: string) => {
    setIsProcessing(true);
    try {
      await onReportComment(commentId);
      toast({
        title: "Success",
        description: "Comment reported successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to report comment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Comments</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              rows={3}
            />
            <div className="flex justify-end">
              <Button
                onClick={() => handleCreateComment()}
                disabled={isProcessing || !newComment.trim()}
              >
                <Send className="h-4 w-4 mr-2" />
                Post Comment
              </Button>
            </div>
          </div>

          {comments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No comments yet. Be the first to comment!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {comments.map((comment) => renderComment(comment))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectComments;
