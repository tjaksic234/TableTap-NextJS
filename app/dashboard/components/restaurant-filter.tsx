import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const cuisineTypes = ["MEAT", "VEGAN", "JAPANESE", "ITALIAN", "INDIAN", "MEXICAN", "CHINESE"];

interface RestaurantFilterProps {
  selectedTypes: string[];
  onTypeChange: (types: string[]) => void;
}

export function RestaurantFilter({ selectedTypes, onTypeChange }: RestaurantFilterProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Filter</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Cuisine Types</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {cuisineTypes.map((type) => (
          <DropdownMenuCheckboxItem
            key={type}
            checked={selectedTypes.includes(type)}
            onCheckedChange={(checked) => {
              if (checked) {
                onTypeChange([...selectedTypes, type]);
              } else {
                onTypeChange(selectedTypes.filter((t) => t !== type));
              }
            }}
          >
            {type}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}