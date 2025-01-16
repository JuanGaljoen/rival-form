import { useState } from 'react';
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

const ComboboxDemo = ({ value, onChange, index, formulas }) => {
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const filteredFormulas = formulas.filter((formula) =>
        formula.formula.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between truncate"
                >
                    <span className="truncate">
                        {value
                            ? formulas.find((formula) => formula.formula === value)?.formula
                            : "Select ingredient..."}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] min-w-[200px] p-2" align="start">
                <div className="flex flex-col gap-2">
                    <Input
                        placeholder="Search ingredients..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-8"
                    />
                    <div className="max-h-48 overflow-y-auto">
                        {filteredFormulas.length === 0 ? (
                            <div className="text-sm text-muted-foreground py-2 text-center">
                                No ingredients found.
                            </div>
                        ) : (
                            filteredFormulas.map((formula) => (
                                <Button
                                    key={`${formula.formula}-${index}`}
                                    variant="ghost"
                                    className="w-full justify-start gap-2"
                                    onClick={() => {
                                        onChange(index, 'formula', formula.formula);
                                        setOpen(false);
                                        setSearchQuery('');
                                    }}
                                >
                                    {value === formula.formula && (
                                        <Check className="h-4 w-4 shrink-0" />
                                    )}
                                    <span className="truncate">{formula.formula}</span>
                                </Button>
                            ))
                        )}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default ComboboxDemo;

