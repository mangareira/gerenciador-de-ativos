import { Option } from "./options";

export type SelectProps = {
  onChange: (value?: string) => void;
  onCreate?: (value: string) => void;
  options?: Option[];
  value?: string | null | undefined;
  disable?: boolean;
  placeholder?: string;
  className?: string 
};
