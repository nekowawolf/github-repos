'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { FaMarkdown, FaBalanceScale } from 'react-icons/fa';
import { FiUsers } from 'react-icons/fi';
import { GoCodeOfConduct } from 'react-icons/go';

type Tab = {
    id: string;
    label: string;
    icon: React.ReactNode;
    content: string | null;
};

type Props = {
    readme: string | null;
    license: string | null;
    contributing: string | null;
    codeOfConduct: string | null;
    licenseName?: string;
    owner: string;
    repoName: string;
    defaultBranch: string;
};

export default function RepoContentTabs({ readme, license, contributing, codeOfConduct, licenseName, owner, repoName, defaultBranch }: Props) {
    const tabs: Tab[] = [
        { id: 'readme', label: 'README', icon: <FaMarkdown className="w-4 h-4" />, content: readme },
        ...(codeOfConduct ? [{ id: 'codeofconduct', label: 'Code of Conduct', icon: <FiUsers className="w-4 h-4" />, content: codeOfConduct }] : []),
        ...(contributing ? [{ id: 'contributing', label: 'Contributing', icon: <GoCodeOfConduct className="w-4 h-4" />, content: contributing }] : []),
        ...(license ? [{ id: 'license', label: licenseName || 'License', icon: <FaBalanceScale className="w-4 h-4" />, content: license }] : []),
    ];

    const [activeTab, setActiveTab] = useState('readme');

    const activeContent = tabs.find(t => t.id === activeTab)?.content;

    if (!readme && !license && !contributing && !codeOfConduct) return null;

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
                                : 'bg-black/20 text-fill-color/60 hover:text-fill-color hover:bg-black/40 border border-white/5'
                        }`}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            {activeContent && (
                <div className="prose prose-invert prose-blue max-w-none prose-img:rounded-xl prose-a:text-blue-400 hover:prose-a:text-blue-300 prose-headings:border-b prose-headings:border-white/10 prose-headings:pb-2 prose-h1:text-3xl prose-h1:font-bold prose-h2:text-2xl prose-h2:font-bold prose-h3:text-xl prose-h3:font-semibold prose-p:leading-relaxed prose-li:leading-relaxed prose-code:bg-white/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-pre:bg-black/40 prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw]}
                        components={{
                            table: ({ node, ...props }: any) => (
                                <div className="overflow-x-auto my-6">
                                    <table {...props} className="w-full" />
                                </div>
                            ),
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
                                return <img {...props} src={src} />;
                            },
                            a: ({ node, children, ...props }: any) => {
                                const href = props.href || '';
                                if (href.startsWith('#')) {
                                    return <a {...props}>{children}</a>;
                                }
                                return <a {...props} target="_blank" rel="noopener noreferrer">{children}</a>;
                            }
                        }}
                    >
                        {activeContent}
                    </ReactMarkdown>
                </div>
            )}
        </div>
    );
}