import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from "@/components/ui/use-toast";
import {
  MessageSquare,
  Send,
  MoreVertical,
  Clock,
  User,
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
import { format, formatDistanceToNow } from 'date-fns';
import { ProjectComment, Profile } from '@/types/database';

interface ExtendedProjectComment extends ProjectComment {
  user: Profile & { role: string };
  likes: number;
  isLiked: boolean;
  replies: ExtendedProjectComment[];
  isEdited: boolean;
}

interface ProjectCommentsProps {
  comments: ExtendedProjectComment[];
  currentUser: Profile & { role: string };
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

  const renderComment = (comment: ExtendedProjectComment, isReply = false) => {
    const isEditing = editingComment === comment.id;
    const isReplying = replyingTo === comment.id;

    return (
      <div key={comment.id} className={`space-y-4 ${isReply ? 'ml-12' : ''}`}>
        <div className="flex gap-4">
          <Avatar>
            <AvatarImage src={comment.user.avatar_url} />
            <AvatarFallback>{getInitials(`${comment.user.first_name} ${comment.user.last_name}`)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{`${comment.user.first_name} ${comment.user.last_name}`}</span>
                  <Badge variant="outline">{comment.user.role}</Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>
                    {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                    {comment.isEdited && ' (edited)'}
                  </span>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {currentUser.id === comment.user.id && (
                    <>
                      <DropdownMenuItem onClick={() => {
                        setEditingComment(comment.id);
                        setEditContent(comment.content);
                      }}>
                        <Edit2 className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDeleteComment(comment.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </>
                  )}
                  {currentUser.id !== comment.user.id && (
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => handleReportComment(comment.id)}
                    >
                      <Flag className="h-4 w-4 mr-2" />
                      Report
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {isEditing ? (
              <div className="space-y-2">
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  placeholder="Edit your comment..."
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
                  <Button onClick={() => handleUpdateComment(comment.id)}>
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sm">{comment.content}</p>
            )}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleLikeComment(comment.id)}
                className={comment.isLiked ? 'text-primary' : ''}
              >
                <ThumbsUp className="h-4 w-4 mr-2" />
                {comment.likes}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setReplyingTo(comment.id)}
              >
                <Reply className="h-4 w-4 mr-2" />
                Reply
              </Button>
            </div>
            {isReplying && (
              <div className="space-y-2">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a reply..."
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
                  <Button onClick={() => handleCreateComment(comment.id)}>
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