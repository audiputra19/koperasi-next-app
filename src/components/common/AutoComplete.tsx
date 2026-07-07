"use client";

import { cn } from "@/src/lib/cn";
import { X } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface AutocompleteProps<T> {
    options: T[];
    placeholder: string;
    selectedValue: string; 
    onSelect: (item: T) => void;
    valueKey: keyof T;
    labelKey: keyof T;
    isLoading?: boolean;
    onClear?: () => void;
}

// Autocomplete ini wajib kombinasi antara kode dan nama!
export function Autocomplete<T>({ 
    options, 
    placeholder, 
    selectedValue, 
    onSelect, 
    valueKey,
    labelKey,
    isLoading = false ,
    onClear
}: AutocompleteProps<T>) {
    const [query, setQuery] = useState(selectedValue || "");
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const [prevSelectedValue, setPrevSelectedValue] = useState(selectedValue);

    if (selectedValue !== prevSelectedValue) {
        setPrevSelectedValue(selectedValue);
        setQuery(selectedValue || "");
    }

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredOptions = query === "" 
        ? options 
        : options.filter((item) => {
            const namaStr = String(item[labelKey] || "").toLowerCase();
            const kodeStr = String(item[valueKey] || "").toLowerCase();
            const queryStr = String(query || "").toLowerCase();

            return namaStr.includes(queryStr) || kodeStr.includes(queryStr);
        });

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault(); 

            const currentQuery = query.trim().toLowerCase();
            if (!currentQuery) return;

            const exactMatch = options.find(
                (item) => String(item[valueKey] || "").toLowerCase() === currentQuery
            );

            if (exactMatch) {
                setQuery("");
                onSelect(exactMatch);
                setIsOpen(false);
            } else if (filteredOptions.length === 1) {
                setQuery("");
                onSelect(filteredOptions[0]);
                setIsOpen(false);
            }
        }
    };    

    return (
        <div ref={containerRef} className="relative w-full">
            <div className="relative flex items-center">
                <input
                    type="text"
                    placeholder={placeholder}
                    value={query}
                    disabled={isLoading}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                    className="w-full border border-base-300 p-2.5 pr-10 rounded-lg text-sm bg-base-100 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 outline-none"
                />
                
                {isLoading ? (
                    <div className="absolute right-3 pointer-events-none">
                        <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                ) : (
                    <div className="absolute right-3">
                        <div 
                            className={cn(
                                "border border-base-300 bg-base-100 p-1 rounded-full cursor-pointer",
                                "hover:bg-base-200"
                            )}
                            onClick={() => {
                                setQuery("");
                                onClear?.();
                            }}
                        >
                            <X size={14}/>
                        </div>
                    </div>
                )}
            </div>
            
            {!isLoading && isOpen && filteredOptions.length > 0 && (
                <ul className="absolute z-50 w-full mt-1 bg-base-200 border border-base-300 rounded-lg max-h-60 overflow-y-auto shadow-lg divide-y divide-base-300">
                    {filteredOptions.map((item, index) => {
                        
                        const itemKey = String(item[valueKey] || index); 
                        
                        return (
                            <li
                                key={itemKey}
                                onClick={() => {
                                    setQuery("");
                                    onSelect(item);
                                    setIsOpen(false);
                                }}
                                className="p-2.5 hover:bg-base-300 cursor-pointer text-sm flex justify-between items-center"
                            >
                                <span className="font-medium">
                                    {String(item[labelKey] || "")}
                                </span>
                                <span className="text-xs text-gray-400 font-mono">
                                    [{String(item[valueKey] || "")}]
                                </span>
                            </li>
                        );
                    })}
                </ul>
            )}

            {!isLoading && isOpen && filteredOptions.length === 0 && (
                <div className="absolute z-50 w-full mt-1 bg-base-200 border border-base-300 rounded-lg p-3 text-center text-xs shadow-lg">
                    Data tidak ditemukan
                </div>
            )}
        </div>
    );
}