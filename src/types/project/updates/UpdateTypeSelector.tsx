import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { UPDATE_TYPE_GROUPS, UpdateGroup } from '@/components/project/updates/constants/updateTypes';
import { UpdateType } from '@/types/projectUpdates';

interface UpdateTypeSelectorProps {
  selectedGroup: UpdateGroup;
  setSelectedGroup: (group: UpdateGroup) => void;
  selectedType: UpdateType;
  setSelectedType: (type: UpdateType) => void;
}

export default function UpdateTypeSelector({
  selectedGroup,
  setSelectedGroup,
  selectedType,
  setSelectedType
}: UpdateTypeSelectorProps) {
  return (
    <Tabs
      value={selectedGroup}
      onValueChange={(value: string) => setSelectedGroup(value as UpdateGroup)}
    >
      <TabsList className="grid grid-cols-5">
        {Object.entries(UPDATE_TYPE_GROUPS).map(([key, { label, icon: Icon }]) => (
          <TabsTrigger key={key} value={key} className="flex items-center gap-2">
            <Icon className="h-4 w-4" />
            {label}
          </TabsTrigger>
        ))}
      </TabsList>
      
      {Object.entries(UPDATE_TYPE_GROUPS).map(([key, { types }]) => (
        <TabsContent key={key} value={key} className="mt-4">
          <div className="grid grid-cols-2 gap-4">
            {types.map(type => (
              <Button
                key={type}
                type="button"
                variant={selectedType === type ? "default" : "outline"}
                className="justify-start"
                onClick={() => setSelectedType(type)}
              >
                {type.replace('_', ' ')}
              </Button>
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
