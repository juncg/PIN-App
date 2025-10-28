"use client";

import { Label } from '@/components/ui/label'
import type { Option } from '@/components/ui/multi-select'
import MultipleSelector from '@/components/ui/multi-select'

interface SelectTagsProps {
  availableTags: { id: number; name: string }[];
  selectedTags: number[];
  onTagsChange: (tagIds: number[]) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
}

const SelectTags = ({ 
  availableTags, 
  selectedTags, 
  onTagsChange, 
  label = "Tags", 
  placeholder = "Selecciona tags", 
  disabled = false 
}: SelectTagsProps) => {

  const tagOptions: Option[] = availableTags.map(tag => ({
    value: tag.id.toString(),
    label: tag.name
  }));

  const selectedOptions: Option[] = availableTags
    .filter(tag => selectedTags.includes(tag.id))
    .map(tag => ({
      value: tag.id.toString(),
      label: tag.name
    }));

  const handleChange = (options: Option[]) => {
    const tagIds = options.map(option => parseInt(option.value));
    onTagsChange(tagIds);
  };

  return (
    <div className='w-full space-y-2'>
      <Label>{label}</Label>
      <MultipleSelector
        commandProps={{
          label: label,
          filter: (value, search) => {
            if (!search) return 1;
            const label = tagOptions.find(opt => opt.value === value)?.label || '';
            return label.toLowerCase().includes(search.toLowerCase()) ? 1 : 0;
          }
        }}
        value={selectedOptions}
        onChange={handleChange}
        defaultOptions={tagOptions}
        placeholder={placeholder}
        disabled={disabled}
        hideClearAllButton={false}
        hidePlaceholderWhenSelected
        emptyIndicator={<p className='text-center text-sm'>No se encontraron tags</p>}
        className='w-full'
      />
    </div>
  )
}

export default SelectTags
