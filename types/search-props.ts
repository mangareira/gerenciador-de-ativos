import { Option } from "./options";

export interface SearchAssetsProps {
  onSearchChange: (search: string) => void;
  onTypeChange?: (type: string) => void;
  onStatusChange?: (status: string) => void;
  titlePlaceholder: string
  typeOptions?: Option[];
  statusOptions?: Option[];
  typePlaceholder?: string;
  statusPlaceholder?: string;
  debounceMs?: number;
}