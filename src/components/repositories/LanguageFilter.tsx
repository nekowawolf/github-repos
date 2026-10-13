'use client';

import { useState, useEffect, useRef } from 'react';
import { FiChevronDown, FiCheck } from 'react-icons/fi';
import { IoLanguageOutline } from 'react-icons/io5';
import * as Flags from 'country-flag-icons/react/3x2';

// --- Language code mapping ---
const LANG_ALIAS_MAP: Record<string, string> = {
    'en': 'US', 'en-us': 'US', 'en-gb': 'GB',
    'zh-cn': 'CN', 'zh': 'CN', 'zh-hans': 'CN',
    'zh-tw': 'TW', 'zh-hant': 'TW',
    'ja': 'JP', 'ja_jp': 'JP', 'ja-jp': 'JP',
    'ko': 'KR', 'ko_kr': 'KR', 'ko-kr': 'KR',
    'es': 'ES', 'es-es': 'ES',
    'fr': 'FR', 'fr-fr': 'FR',
    'de': 'DE', 'de-de': 'DE',
    'it': 'IT', 'it-it': 'IT',
    'pt-br': 'BR', 'pt_br': 'BR',
    'pt': 'PT', 'pt-pt': 'PT',
    'ru': 'RU', 'ru-ru': 'RU',
    'id': 'ID', 'id-id': 'ID',
    'tr': 'TR', 'tr-tr': 'TR',
    'ar': 'SA', 'ar-sa': 'SA',
    'hi': 'IN', 'hi-in': 'IN',
    'vi': 'VN', 'vi-vn': 'VN',
    'th': 'TH', 'th-th': 'TH',
    'pl': 'PL', 'pl-pl': 'PL',
    'uk': 'UA', 'uk-ua': 'UA',
    'nl': 'NL', 'nl-nl': 'NL',
    'cs': 'CZ', 'cs-cz': 'CZ',
    'fa': 'IR', 'fa-ir': 'IR',
};

export const extractLangCode = (filename: string): string | null => {
    const lower = filename.toLowerCase();

    const match = lower.match(/^readme[.\-_]([a-z]{2,3}(?:[_\-][a-z]{2,4})?)\.(md|mdx)$/);
    if (!match) return null;

    const rawCode = match[1].toLowerCase();

    if (LANG_ALIAS_MAP[rawCode]) return LANG_ALIAS_MAP[rawCode];

    const hyphenated = rawCode.replace(/_/g, '-');
    if (LANG_ALIAS_MAP[hyphenated]) return LANG_ALIAS_MAP[hyphenated];

    if (hyphenated.includes('-')) {
        const parts = hyphenated.split('-');
        return parts[parts.length - 1].toUpperCase();
    }

    return rawCode.toUpperCase();
};

export type ReadmeLangEntry = {
    lang: string;
    content: string;
    filename: string;
};

// --- Language Filter Dropdown ---
export default function LanguageFilter({ 
    availableLangs, 
    selectedLang, 
    setSelectedLang 
}: { 
    availableLangs: string[]; 
    selectedLang: string; 
    setSelectedLang: (lang: string) => void;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const hasActiveFilter = selectedLang !== 'Default';

    return (
        <div className="relative inline-block text-left shrink-0" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors duration-200 cursor-pointer
                    ${isOpen || hasActiveFilter ? 'bg-blue-500/20 text-fill-color border border-blue-500/50' : 'bg-[rgba(var(--fill-color-rgb),0.05)] text-fill-color/60 border border-[var(--border-divider)] hover:text-fill-color hover:border-blue-600'}
                `}
            >
                <IoLanguageOutline className={`w-4 h-4 ${isOpen || hasActiveFilter ? 'text-blue-400' : ''}`} />
                {hasActiveFilter && (
                    <div className="flex items-center gap-1.5">
                        {Flags[selectedLang as keyof typeof Flags] && (
                            (() => {
                                const FlagComponent = Flags[selectedLang as keyof typeof Flags];
                                return <FlagComponent className="w-3.5 h-2.5 rounded-sm object-cover" />;
                            })()
                        )}
                        <span className="text-xs">{selectedLang}</span>
                    </div>
                )}
                <FiChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute z-50 mt-2 w-44 rounded-xl bg-[var(--card-color)] border border-[var(--border-divider)] shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 right-0 origin-top-right">
                    {/* Sticky header */}
                    <div className="flex items-center gap-1.5 px-5 pt-4 pb-2 text-fill-color/50 border-b border-[var(--border-divider)]">
                        <IoLanguageOutline className="w-3.5 h-3.5" />
                        <h3 className="text-xs font-semibold uppercase tracking-wider">Language</h3>
                    </div>
                    {/* Scrollable language list */}
                    <div className="max-h-52 overflow-y-auto custom-scrollbar px-3 py-2">
                        <div className="space-y-1">
                            {availableLangs.map(lang => (
                                <button
                                    key={lang}
                                    onClick={() => {
                                        setSelectedLang(lang);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors cursor-pointer ${selectedLang === lang
                                            ? 'bg-blue-500/20 text-blue-400 font-medium'
                                            : 'text-fill-color/70 hover:bg-[rgba(var(--fill-color-rgb),0.1)] hover:text-fill-color'
                                        }`}
                                >
                                    <div className="flex items-center gap-2">
                                        {lang !== 'Default' && Flags[lang as keyof typeof Flags] && (
                                            (() => {
                                                const FlagComponent = Flags[lang as keyof typeof Flags];
                                                return <FlagComponent className="w-4 h-3 rounded-sm object-cover" />;
                                            })()
                                        )}
                                        <span>{lang === 'Default' ? 'Default' : lang}</span>
                                    </div>
                                    {selectedLang === lang && <FiCheck className="w-4 h-4" />}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}