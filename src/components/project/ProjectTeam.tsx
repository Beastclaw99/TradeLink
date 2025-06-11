import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from "@/components/ui/use-toast";
import {
  Users,
  Plus,
  Mail,
  Phone,
  Briefcase,
  Calendar,
  Edit2,
  Trash2,
  UserPlus
} from 'lucide-react';
import { Profile } from '@/types/database';

interface TeamMember extends Profile {
  role: string;
  joinDate: string;
  status: 'active' | 'inactive';
  skills: string[];
  availability: {
    hoursPerWeek: number;
    preferredSchedule: string[];
  };
}

interface ProjectTeamProps {
  team: TeamMember[];
  isClient: boolean;
  onAddMember: (member: Omit<TeamMember, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onUpdateMember: (memberId: string, member: Partial<TeamMember>) => Promise<void>;
  onRemoveMember: (memberId: string) => Promise<void>;
  availableRoles: string[];
}

const ProjectTeam: React.FC<ProjectTeamProps> = ({
  team,
  isClient,
  onAddMember,
  onUpdateMember,
  onRemoveMember,
  availableRoles
}) => {
  const { toast } = useToast();
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [editingMember, setEditingMember] = useState<string | null>(null);
  const [newMember, setNewMember] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    role: '',
    skills: [] as string[],
    availability: {
      hoursPerWeek: 40,
      preferredSchedule: ['Monday-Friday']
    }
  });
  const [newSkill, setNewSkill] = useState('');

  const handleAddMember = async () => {
    if (!newMember.first_name.trim() || !newMember.last_name.trim() || !newMember.email.trim() || !newMember.role) return;

    try {
      await onAddMember({
        ...newMember,
        joinDate: new Date().toISOString(),
        status: 'active'
      });
      setNewMember({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        role: '',
        skills: [],
        availability: {
          hoursPerWeek: 40,
          preferredSchedule: ['Monday-Friday']
        }
      });
      setIsAddingMember(false);
      toast({
        title: "Success",
        description: "Team member added successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add team member. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateMember = async (memberId: string, updates: Partial<TeamMember>) => {
    try {
      await onUpdateMember(memberId, updates);
      setEditingMember(null);
      toast({
        title: "Success",
        description: "Team member updated successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update team member. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      await onRemoveMember(memberId);
      toast({
        title: "Success",
        description: "Team member removed successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove team member. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;

    setNewMember(prev => ({
      ...prev,
      skills: [...prev.skills, newSkill.trim()]
    }));
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setNewMember(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
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
          <CardTitle>Project Team</CardTitle>
          {isClient && (
            <Dialog open={isAddingMember} onOpenChange={setIsAddingMember}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Team Member
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Team Member</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      value={newMember.first_name}
                      onChange={(e) => setNewMember(prev => ({ ...prev, first_name: e.target.value }))}
                      placeholder="Enter team member's first name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                      id="last_name"
                      value={newMember.last_name}
                      onChange={(e) => setNewMember(prev => ({ ...prev, last_name: e.target.value }))}
                      placeholder="Enter team member's last name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newMember.email}
                      onChange={(e) => setNewMember(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter team member's email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={newMember.phone}
                      onChange={(e) => setNewMember(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Enter team member's phone number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select
                      value={newMember.role}
                      onValueChange={(value) => setNewMember(prev => ({ ...prev, role: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableRoles.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Skills</Label>
                    <div className="flex gap-2">
                      <Input
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        placeholder="Add a skill"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddSkill();
                          }
                        }}
                      />
                      <Button type="button" onClick={handleAddSkill}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {newMember.skills.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill)}
                            className="ml-1 hover:text-destructive"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Availability</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="hoursPerWeek">Hours per Week</Label>
                        <Input
                          id="hoursPerWeek"
                          type="number"
                          min="0"
                          max="168"
                          value={newMember.availability.hoursPerWeek}
                          onChange={(e) => setNewMember(prev => ({
                            ...prev,
                            availability: {
                              ...prev.availability,
                              hoursPerWeek: parseInt(e.target.value) || 0
                            }
                          }))}
                        />
                      </div>
                      <div>
                        <Label>Preferred Schedule</Label>
                        <Select
                          value={newMember.availability.preferredSchedule[0]}
                          onValueChange={(value) => setNewMember(prev => ({
                            ...prev,
                            availability: {
                              ...prev.availability,
                              preferredSchedule: [value]
                            }
                          }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select schedule" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Monday-Friday">Monday - Friday</SelectItem>
                            <SelectItem value="Weekends">Weekends</SelectItem>
                            <SelectItem value="Flexible">Flexible</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddingMember(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddMember}>
                    Add Member
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {team.map((member) => (
            <Card key={member.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={member.avatar_url} />
                    <AvatarFallback>{getInitials(`${member.first_name} ${member.last_name}`)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{`${member.first_name} ${member.last_name}`}</h3>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>
                </div>
                {isClient && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditingMember(member.id)}>
                        <Edit2 className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleRemoveMember(member.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4" />
                  <span>{member.email}</span>
                </div>
                {member.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4" />
                    <span>{member.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {format(new Date(member.joinDate), 'MMM d, yyyy')}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Briefcase className="h-4 w-4" />
                  <span>{member.availability.hoursPerWeek} hours/week</span>
                </div>
              </div>
              {member.skills.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {member.skills.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectTeam; 