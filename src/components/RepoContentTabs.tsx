'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { FaMarkdown, FaBalanceScale, FaRegCopy, FaCheck } from 'react-icons/fa';
import { FiUsers } from 'react-icons/fi';
import { GoCodeOfConduct } from 'react-icons/go';

type Tab = {
    id: string;
    label: string;
    icon: React.ReactNode;
    content: string | null;
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
                className="absolute top-2 right-2 p-1.5 rounded-md bg-[rgba(var(--fill-color-rgb),0.1)] transition-all hover:bg-[rgba(var(--fill-color-rgb),0.2)] text-fill-color/70 z-10"
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
    const getTabConfig = (name: string, content: string): Tab => {
        const lowerName = name.toLowerCase();
        if (lowerName.startsWith('readme')) {
            return { id: name, label: 'README', icon: <FaMarkdown className="w-4 h-4" />, content };
        }
        if (lowerName.startsWith('code_of_conduct')) {
            return { id: name, label: 'Code of Conduct', icon: <FiUsers className="w-4 h-4" />, content };
        }
        if (lowerName.startsWith('contributing')) {
            return { id: name, label: 'Contributing', icon: <GoCodeOfConduct className="w-4 h-4" />, content };
        }
        if (lowerName.startsWith('license')) {
            return { id: name, label: licenseName || 'License', icon: <FaBalanceScale className="w-4 h-4" />, content };
        }
        // Generic markdown file
        return { 
            id: name, 
            label: name.replace(/\.mdx?$/i, ''), 
            icon: <FaMarkdown className="w-4 h-4" />, 
            content 
        };
    };

    const tabs: Tab[] = mdFiles.map(f => getTabConfig(f.name, f.content));

    const [activeTab, setActiveTab] = useState(tabs[0]?.id || '');

    useEffect(() => {
        if (!activeTab && tabs.length > 0) {
            setActiveTab(tabs[0].id);
        }
    }, [tabs, activeTab]);

    const activeContent = tabs.find(t => t.id === activeTab)?.content || tabs[0]?.content;

    if (tabs.length === 0) return null;

    return (
        <div className="glass-card rounded-3xl p-8 border border-white/10 overflow-hidden mt-8">
            {/* Tabs */}
            <div className="flex flex-wrap items-center gap-2 mb-6 pb-4 border-b border-white/10">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                            activeTab === tab.id
                                ? 'bg-blue-600 text-white'
                                : 'bg-[rgba(var(--fill-color-rgb),0.05)] text-fill-color/60 hover:text-fill-color hover:bg-[rgba(var(--fill-color-rgb),0.1)] border border-[var(--border-divider)]'
                        }`}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
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

                                return <img {...props} src={src} style={style} className={`inline-block m-0 ${props.className || ''}`} />;
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