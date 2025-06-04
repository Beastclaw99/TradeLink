import { Project } from '../types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";

interface ProjectCardProps {
  project: Project;
  onEditInitiate: (project: Project) => void;
  onDeleteInitiate: (projectId: string) => void;
}

export const ProjectCard = ({ project, onEditInitiate, onDeleteInitiate }: ProjectCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-start">
          <span className="line-clamp-1">{project.title}</span>
          <Badge variant={project.status === 'completed' ? 'default' : 'secondary'}>
            {project.status}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {project.description}
        </p>
        {project.budget && (
          <p className="mt-2 text-sm font-medium">
            Budget: ${project.budget}
          </p>
        )}
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEditInitiate(project)}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDeleteInitiate(project.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}; 