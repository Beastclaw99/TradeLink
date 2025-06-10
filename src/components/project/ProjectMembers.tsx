import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from "@/components/ui/use-toast";
import {
  Users,
  UserPlus,
  Mail,
  Shield,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProjectMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  status: 'active' | 'pending' | 'inactive';
  joinedAt: string;
  lastActive?: string;
}

interface ProjectMembersProps {
  members: ProjectMember[];
  isAdmin: boolean;
  onInviteMember: (email: string, role: ProjectMember['role']) => Promise<void>;
  onUpdateMemberRole: (memberId: string, role: ProjectMember['role']) => Promise<void>;
  onRemoveMember: (memberId: string) => Promise<void>;
}

const ProjectMembers: React.FC<ProjectMembersProps> = ({
  members,
  isAdmin,
  onInviteMember,
  onUpdateMemberRole,
  onRemoveMember
}) => {
  const { toast } = useToast();
  const [isInviting, setIsInviting] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<ProjectMember['role']>('member');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInvite = async () => {
    if (!inviteEmail.trim()) return;

    setIsProcessing(true);
    try {
      await onInviteMember(inviteEmail.trim(), inviteRole);
      setInviteEmail('');
      setInviteRole('member');
      setIsInviting(false);
      toast({
        title: "Success",
        description: "Invitation sent successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send invitation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdateRole = async (memberId: string, role: ProjectMember['role']) => {
    setIsProcessing(true);
    try {
      await onUpdateMemberRole(memberId, role);
      toast({
        title: "Success",
        description: "Member role updated successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update member role. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemove = async (memberId: string) => {
    setIsProcessing(true);
    try {
      await onRemoveMember(memberId);
      toast({
        title: "Success",
        description: "Member removed successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove member. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getRoleBadge = (role: ProjectMember['role']) => {
    const roleConfig: Record<ProjectMember['role'], { color: string; icon: React.ReactNode }> = {
      owner: {
        color: 'bg-purple-100 text-purple-800 border-purple-200',
        icon: <Shield className="h-4 w-4" />
      },
      admin: {
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: <Shield className="h-4 w-4" />
      },
      member: {
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: <Users className="h-4 w-4" />
      },
      viewer: {
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: <Users className="h-4 w-4" />
      }
    };

    const { color, icon } = roleConfig[role];
    return (
      <Badge variant="outline" className={color}>
        {icon}
        <span className="ml-1">
          {role.charAt(0).toUpperCase() + role.slice(1)}
        </span>
      </Badge>
    );
  };

  const getStatusBadge = (status: ProjectMember['status']) => {
    const statusConfig: Record<ProjectMember['status'], { color: string; icon: React.ReactNode }> = {
      active: {
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: <CheckCircle2 className="h-4 w-4" />
      },
      pending: {
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: <Clock className="h-4 w-4" />
      },
      inactive: {
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: <XCircle className="h-4 w-4" />
      }
    };

    const { color, icon } = statusConfig[status];
    return (
      <Badge variant="outline" className={color}>
        {icon}
        <span className="ml-1">
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </Badge>
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex justify-between items-center">
          <CardTitle>Project Members</CardTitle>
          {isAdmin && (
            <Button
              onClick={() => setIsInviting(true)}
              disabled={isProcessing}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Invite Member
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {isInviting && (
          <div className="mb-6 p-4 border rounded-lg bg-gray-50">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="invite-email">Email Address</Label>
                <Input
                  id="invite-email"
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="Enter email address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="invite-role">Role</Label>
                <Select
                  value={inviteRole}
                  onValueChange={(value) => setInviteRole(value as ProjectMember['role'])}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsInviting(false);
                    setInviteEmail('');
                    setInviteRole('member');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleInvite}
                  disabled={isProcessing || !inviteEmail.trim()}
                >
                  Send Invitation
                </Button>
              </div>
            </div>
          </div>
        )}

        {members.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>No members have been added to this project yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{member.name}</span>
                      {getRoleBadge(member.role)}
                      {getStatusBadge(member.status)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Mail className="h-4 w-4" />
                      <span>{member.email}</span>
                    </div>
                  </div>
                </div>
                {isAdmin && member.role !== 'owner' && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleUpdateRole(member.id, 'admin')}
                        disabled={isProcessing || member.role === 'admin'}
                      >
                        Make Admin
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleUpdateRole(member.id, 'member')}
                        disabled={isProcessing || member.role === 'member'}
                      >
                        Make Member
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleUpdateRole(member.id, 'viewer')}
                        disabled={isProcessing || member.role === 'viewer'}
                      >
                        Make Viewer
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleRemove(member.id)}
                        disabled={isProcessing}
                        className="text-red-600"
                      >
                        Remove Member
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectMembers; 