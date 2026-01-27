import { Option } from "./options";

export interface SearchAssetsProps {
  onSearchChange: (search: string) => void;
  onTypeChange: (type: string) => void;
  onStatusChange: (status: string) => void;
  typeOptions: Option[];
  statusOptions: Option[];
  titlePlaceholder: string
  typePlaceholder?: string;
  statusPlaceholder?: string;
  debounceMs?: number;
}