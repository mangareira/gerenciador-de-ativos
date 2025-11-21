// components/dynamic-specifications.tsx
'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import { CreateAsset } from "@/utils/schemas/schemas";
import { Plus, X } from "lucide-react";
import { useState } from "react";

export function DynamicSpecifications() {
  const [newFieldName, setNewFieldName] = useState("");
  const { control, watch, setValue } = useFormContext<CreateAsset>();

  const specifications = watch("specifications") || {};

  const addField = () => {
    if (!newFieldName.trim()) return;
    
    const fieldName = newFieldName.trim();
    
    setValue("specifications", {
      ...specifications,
      [fieldName]: ""
    }, {
      shouldValidate: true,
      shouldDirty: true
    });
    
    setNewFieldName("");
  }

  const removeField = (fieldName: string) => {
    const currentValues = { ...specifications };
    delete currentValues[fieldName];
    
    setValue("specifications", currentValues, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Nome da especificação"
          value={newFieldName}
          onChange={(e) => setNewFieldName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addField();
            }
          }}
          className="flex-1"
        />
        <Button 
          type="button" 
          onClick={addField}
          size="sm"
          className="h-10 w-10 p-0"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {Object.keys(specifications).map((key) => (
        <div key={key} className="flex items-center gap-2">
          <div className="w-1/3">
            <Label className="text-sm font-medium capitalize">
              {key}
            </Label>
          </div>
          
          <div className="flex-1 flex items-center gap-2">
            <FormField
              control={control}
              name={`specifications.${key}`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input 
                      placeholder={`Valor para ${key}`}
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => removeField(key)}
              className="h-10 w-10 p-0 shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}