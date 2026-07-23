'use client';

import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { FaMarkdown, FaBalanceScale, FaRegCopy, FaCheck } from 'react-icons/fa';
import { FiUsers } from 'react-icons/fi';
import { GoCodeOfConduct } from 'react-icons/go';
import LanguageFilter, { extractLangCode, ReadmeLangEntry } from './LanguageFilter';

type Tab = {
    id: string;
    label: string;
    icon: React.ReactNode;
    content: string;
    filename: string;
};

type Props = {
    mdFiles: { name: string, content: string }[];
    licenseName?: string;
    owner: string;
    repoName: string;
    defaultBranch: string;
};

const extractText = (child: any): string => {
    if (typeof child === 'string') return child;
    if (Array.isArray(child)) return child.map(extractText).join('');
    if (child && child.props && child.props.children) {
        return extractText(child.props.children);
    }
    return '';
};

const PreBlock = ({ node, children, ...props }: any) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        const textToCopy = extractText(children);
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative group w-fit max-w-full my-6">
            <button
                onClick={handleCopy}
                className="cursor-pointer absolute top-2 right-2 p-1.5 rounded-md bg-[rgba(var(--fill-color-rgb),0.1)] transition-all hover:bg-[rgba(var(--fill-color-rgb),0.2)] text-fill-color/70 z-10"
                aria-label="Copy code"
                title="Copy"
            >
                {copied ? <FaCheck className="w-3.5 h-3.5 text-green-500" /> : <FaRegCopy className="w-3.5 h-3.5" />}
            </button>
            <pre {...props} className="text-fill-color !m-0 !pr-12 w-full overflow-x-auto bg-[rgba(var(--fill-color-rgb),0.03)] border border-[var(--border-divider)] rounded-xl py-4 px-5">
                {children}
            </pre>
        </div>
    );
};

const MarkdownLink = ({ href, children, ...props }: any) => {
    const [videoError, setVideoError] = useState(false);
    const hrefStr = href || '';

    if (hrefStr.startsWith('#')) {
        return <a href={hrefStr} {...props}>{children}</a>;
    }

    const isGithubAsset = hrefStr.includes('github.com/user-attachments/assets/');
    const isVideoExt = hrefStr.match(/\.(mp4|webm|ogg|mov)$/i);
    const linkText = extractText(children);
    const isRawLink = linkText === hrefStr;

    if (!videoError && (isVideoExt || (isGithubAsset && isRawLink))) {
        return (
            <video 
                src={hrefStr} 
                controls 
                className="w-full max-h-[600px] rounded-xl my-6 border border-[var(--border-divider)] bg-[rgba(var(--fill-color-rgb),0.03)]"
                onError={() => setVideoError(true)}
            />
        );
    }

    return <a href={hrefStr} {...props} target="_blank" rel="noopener noreferrer">{children}</a>;
};

export default function RepoContentTabs({ mdFiles, licenseName, owner, repoName, defaultBranch }: Props) {
    const groupedTabs = new Map<string, Tab>();
    const readmeLangs: ReadmeLangEntry[] = [];

    mdFiles.forEach(f => {
        const lowerName = f.name.toLowerCase();

        // --- Handle README files ---
        if (lowerName.startsWith('readme')) {
            const isMainReadme = lowerName === 'readme.md' || lowerName === 'readme.mdx';
            const langCode = isMainReadme ? null : extractLangCode(f.name);

            if (isMainReadme) {
                if (!groupedTabs.has('readme')) {
                    groupedTabs.set('readme', { 
                        id: 'readme', label: 'README', 
                        icon: <FaMarkdown className="w-4 h-4" />, 
                        content: f.content, filename: f.name 
                    });
                }
                readmeLangs.push({ lang: 'Default', content: f.content, filename: f.name });
            } else if (langCode) {
                readmeLangs.push({ lang: langCode, content: f.content, filename: f.name });
            }
            return;
        }

        // --- Handle other files ---
        let baseId = '';
        let label = '';
        let icon = null;

        if (lowerName === 'code_of_conduct.md' || lowerName === 'code_of_conduct.mdx') {
            baseId = 'code_of_conduct'; label = 'Code of Conduct'; icon = <FiUsers className="w-4 h-4" />;
        } else if (lowerName === 'contributing.md' || lowerName === 'contributing.mdx') {
            baseId = 'contributing'; label = 'Contributing'; icon = <GoCodeOfConduct className="w-4 h-4" />;
        } else if (lowerName.startsWith('license')) {
            baseId = 'license'; label = licenseName || 'License'; icon = <FaBalanceScale className="w-4 h-4" />;
        } else {
            if (lowerName.startsWith('contributing') || lowerName.startsWith('code_of_conduct')) {
                return;
            }
            baseId = lowerName; label = f.name.replace(/\.mdx?$/i, ''); icon = <FaMarkdown className="w-4 h-4" />;
        }
        
        if (!groupedTabs.has(baseId)) {
            groupedTabs.set(baseId, { id: baseId, label, icon, content: f.content, filename: f.name });
        }
    });

    const tabs: Tab[] = Array.from(groupedTabs.values());

    const sortedLangs = readmeLangs
        .map(r => r.lang)
        .filter((v, i, a) => a.indexOf(v) === i)
        .sort((a, b) => {
            if (a === 'Default') return -1;
            if (b === 'Default') return 1;
            return a.localeCompare(b);
        });

    const [activeTab, setActiveTab] = useState(tabs[0]?.id || '');
    const [selectedLang, setSelectedLang] = useState('Default');

    useEffect(() => {
        if (!activeTab && tabs.length > 0) {
            setActiveTab(tabs[0].id);
        }
    }, [tabs, activeTab]);

    const activeTabObj = tabs.find(t => t.id === activeTab) || tabs[0];

    let activeContent = activeTabObj?.content;
    if (activeTabObj?.id === 'readme' && readmeLangs.length > 0) {
        const langEntry = readmeLangs.find(r => r.lang === selectedLang);
        if (langEntry) {
            activeContent = langEntry.content;
        } else {
            const defaultEntry = readmeLangs.find(r => r.lang === 'Default');
            if (defaultEntry) activeContent = defaultEntry.content;
        }
    }

    const showLangFilter = activeTabObj?.id === 'readme' && sortedLangs.length > 1;

    const scrollRef = useRef<HTMLDivElement>(null);
    const fadeRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    useEffect(() => {
        const checkOverflow = () => {
            if (scrollRef.current && fadeRef.current) {
                const { scrollWidth, clientWidth, scrollLeft } = scrollRef.current;
                const hasMore = Math.ceil(scrollLeft + clientWidth) < scrollWidth - 1;
                fadeRef.current.style.opacity = hasMore ? '1' : '0';
                fadeRef.current.style.visibility = hasMore ? 'visible' : 'hidden';
            }
        };

        const timeoutId = setTimeout(checkOverflow, 50);
        
        window.addEventListener('resize', checkOverflow);
        const scrollElement = scrollRef.current;
        if (scrollElement) {
            scrollElement.addEventListener('scroll', checkOverflow);
        }
        
        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('resize', checkOverflow);
            if (scrollElement) {
                scrollElement.removeEventListener('scroll', checkOverflow);
            }
        };
    }, [tabs.length]);

    const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!scrollRef.current) return;
        setIsDragging(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
    };

    const onMouseLeave = () => {
        setIsDragging(false);
    };

    const onMouseUp = () => {
        setIsDragging(false);
    };

    const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDragging || !scrollRef.current) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 2;
        scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    if (tabs.length === 0) return null;

    return (
        <div className="glass-card rounded-3xl p-8 border border-white/10 overflow-hidden mt-8">
            {/* Tabs & Language Filter */}
            <div className="flex flex-row items-start justify-between gap-3 mb-6 pb-4 border-b border-white/10">
                <div className="relative flex-1 min-w-0 overflow-hidden">
                    <div 
                        ref={scrollRef}
                        onMouseDown={onMouseDown}
                        onMouseLeave={onMouseLeave}
                        onMouseUp={onMouseUp}
                        onMouseMove={onMouseMove}
                        className={`flex items-center gap-2 overflow-x-auto pb-3 w-full max-md:[&::-webkit-scrollbar]:hidden max-md:[-ms-overflow-style:none] max-md:[scrollbar-width:none] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-blue-500/30 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-blue-500/60 ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'}`}
                    >
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap flex-shrink-0 ${
                                    activeTab === tab.id
                                        ? 'bg-blue-600 text-white border border-transparent'
                                        : 'bg-[rgba(var(--fill-color-rgb),0.05)] text-fill-color/60 hover:text-fill-color hover:bg-[rgba(var(--fill-color-rgb),0.1)] border border-[var(--border-divider)]'
                                }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>
                    {/* Fade indicator */}
                    <div 
                        ref={fadeRef}
                        className="absolute right-0 top-0 h-[38px] w-12 bg-gradient-to-l from-blue-600/20 to-transparent pointer-events-none transition-opacity duration-200" 
                        style={{ opacity: 0, visibility: 'hidden' }}
                    />
                </div>

                {/* Language Filter */}
                {showLangFilter && (
                    <LanguageFilter
                        availableLangs={sortedLangs}
                        selectedLang={selectedLang}
                        setSelectedLang={setSelectedLang}
                    />
                )}
            </div>

            {/* Content */}
            {activeContent && (
                <div className="prose prose-invert prose-blue max-w-none prose-img:rounded-xl prose-a:text-blue-400 hover:prose-a:text-blue-300 prose-p:leading-relaxed prose-li:leading-relaxed text-sm sm:text-[15px]">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw]}
                        components={{
                            pre: PreBlock,
                            video: (props: any) => (
                                <video {...props} className={`w-full max-h-[600px] rounded-xl my-6 border border-[var(--border-divider)] bg-[rgba(var(--fill-color-rgb),0.03)] ${props.className || ''}`} controls />
                            ),
                            table: ({ node, ...props }: any) => (
                                <div className="overflow-x-auto my-6">
                                    <table {...props} className="w-full" />
                                </div>
                            ),
                            p: (props: any) => {
                                const style = { ...props.style };
                                if (props.align) {
                                    style.textAlign = props.align;
                                }
                                return <p {...props} style={style} />;
                            },
                            img: (props: any) => {
                                let src = props.src || '';
                                if (src && !src.startsWith('http') && !src.startsWith('data:')) {
                                    const hashIdx = src.indexOf('#');
                                    const qIdx = src.indexOf('?');
                                    let basePath = src;
                                    let hash = '';
                                    let query = '';

                                    if (hashIdx !== -1) {
                                        hash = src.substring(hashIdx);
                                        basePath = src.substring(0, hashIdx);
                                    }
                                    if (qIdx !== -1 && (hashIdx === -1 || qIdx < hashIdx)) {
                                        query = basePath.substring(qIdx);
                                        basePath = basePath.substring(0, qIdx);
                                    }

                                    const resolvedPath = basePath.replace(/^(\.\/|\.\.\/|\/)+/g, '');
                                    src = `https://raw.githubusercontent.com/${owner}/${repoName}/${defaultBranch}/${resolvedPath}`;

                                    if (query) src += query;
                                    if (hash) src += hash;
                                }

                                const style = { ...props.style };
                                if (props.width) {
                                    style.width = !isNaN(Number(props.width)) ? `${props.width}px` : props.width;
                                }
                                if (props.height) {
                                    style.height = !isNaN(Number(props.height)) ? `${props.height}px` : props.height;
                                }

                                return <img {...props} src={src} style={style} className={`inline-block !my-1 !mx-0.5 ${props.className || ''}`} />;
                            },
                            a: MarkdownLink
                        }}
                    >
                        {activeContent}
                    </ReactMarkdown>
                </div>
            )}
        </div>
    );
}