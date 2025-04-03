
import { LayoutGrid, LayoutList } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useIsMobile } from "@/hooks/use-mobile";

interface ToggleViewProps {
  view: 'grid' | 'compact';
  onViewChange: (view: 'grid' | 'compact') => void;
}

export const ToggleView = ({ view, onViewChange }: ToggleViewProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex justify-end mb-3">
      <ToggleGroup type="single" value={view} onValueChange={(value) => value && onViewChange(value as 'grid' | 'compact')}>
        <ToggleGroupItem value="grid" aria-label="Grid view" className="p-2" title="Standard Grid View">
          <LayoutGrid className="h-4 w-4" />
          {!isMobile && <span className="ml-2">Grid</span>}
        </ToggleGroupItem>
        <ToggleGroupItem value="compact" aria-label="Compact view" className="p-2" title="Compact Theater View">
          <LayoutList className="h-4 w-4" />
          {!isMobile && <span className="ml-2">Compact</span>}
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};
