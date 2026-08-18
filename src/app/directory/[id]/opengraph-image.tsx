import { ImageResponse } from 'next/og';
import { readFileSync } from 'fs';
import { join } from 'path';
import { fetchGithubReposData } from "@/services/githubRepoService";

export const alt = 'Repository Details';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const runtime = 'nodejs';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Image({ params }: Props) {
  const resolvedParams = await params;
  const reposData = await fetchGithubReposData();
  const repo = reposData.find((t) => (t._id || (t as any).id)?.toString() === resolvedParams.id);

  if (!repo) {
    return new ImageResponse(
      (
        <div
          style={{
            background: '#111827',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontSize: 48,
          }}
        >
          Repository Not Found
        </div>
      ),
      { ...size }
    );
  }

  const stars = repo.stats?.stars || 0;
  const forks = repo.stats?.forks || 0;
  const language = repo.stats?.language || 'N/A';

  const nodeBuffer = readFileSync(join(process.cwd(), 'public', 'img', 'OG_background.png'));
  const bgImgBuffer = nodeBuffer.buffer.slice(nodeBuffer.byteOffset, nodeBuffer.byteOffset + nodeBuffer.byteLength);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          position: 'relative',
          padding: '80px',
        }}
      >
        <img
          src={bgImgBuffer as any}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />

        {/* Content wrapper */}
        <div style={{ display: 'flex', flexDirection: 'column', zIndex: 10, maxWidth: '55%' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div 
              style={{ 
                width: '16px', 
                height: '16px', 
                backgroundColor: '#2563eb',
              }} 
            />
            <span style={{ fontSize: 22, color: '#f3f4f6', fontWeight: 500 }}>/github-repos</span>
          </div>

          <h1 style={{ fontSize: 72, fontWeight: 800, color: '#ffffff', margin: '0 0 16px 0', lineHeight: 1.1 }}>
            {repo.name}
          </h1>

          <p style={{ 
            fontSize: 24, 
            fontWeight: 400,
            color: 'rgba(255, 255, 255, 0.9)', 
            lineHeight: 1.5, 
            margin: '0 0 32px 0',
          }}>
            {repo.description && repo.description.length > 200 
              ? repo.description.slice(0, 200).trim() + '...' 
              : repo.description}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '28px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: 18, color: 'rgba(255, 255, 255, 0.7)' }}>Stars</span>
              <span style={{ fontSize: 18, fontWeight: 'bold', color: '#ffffff', textShadow: '0 0 15px rgba(255,255,255,1), 0 0 30px rgba(255,255,255,0.8)' }}>
                {stars.toLocaleString()}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: 18, color: 'rgba(255, 255, 255, 0.7)' }}>Forks</span>
              <span style={{ fontSize: 18, fontWeight: 'bold', color: '#ffffff', textShadow: '0 0 15px rgba(255,255,255,1), 0 0 30px rgba(255,255,255,0.8)' }}>
                {forks.toLocaleString()}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: 18, color: 'rgba(255, 255, 255, 0.7)' }}>Lang</span>
              <span style={{ fontSize: 18, fontWeight: 'bold', color: '#ffffff', textShadow: '0 0 15px rgba(255,255,255,1), 0 0 30px rgba(255,255,255,0.8)' }}>
                {language}
              </span>
            </div>
          </div>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            backgroundColor: '#ffffff', 
            padding: '8px 20px', 
            borderRadius: '999px',
            alignSelf: 'flex-start',
          }}>
            {/* X Icon */}
            <svg width="18" height="18" viewBox="0 0 512 512" fill="#000000"><path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"/></svg>
            {/* IG Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#000000" viewBox="0 0 16 16">
              <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334"/>
            </svg>
            {/* Threads Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#000000" viewBox="0 0 16 16">
              <path d="M6.321 6.016c-.27-.18-1.166-.802-1.166-.802.756-1.081 1.753-1.502 3.132-1.502.975 0 1.803.327 2.394.948s.928 1.509 1.005 2.644q.492.207.905.484c1.109.745 1.719 1.86 1.719 3.137 0 2.716-2.226 5.075-6.256 5.075C4.594 16 1 13.987 1 7.994 1 2.034 4.482 0 8.044 0 9.69 0 13.55.243 15 5.036l-1.36.353C12.516 1.974 10.163 1.43 8.006 1.43c-3.565 0-5.582 2.171-5.582 6.79 0 4.143 2.254 6.343 5.63 6.343 2.777 0 4.847-1.443 4.847-3.556 0-1.438-1.208-2.127-1.27-2.127-.236 1.234-.868 3.31-3.644 3.31-1.618 0-3.013-1.118-3.013-2.582 0-2.09 1.984-2.847 3.55-2.847.586 0 1.294.04 1.663.114 0-.637-.54-1.728-1.9-1.728-1.25 0-1.566.405-1.967.868ZM8.716 8.19c-2.04 0-2.304.87-2.304 1.416 0 .878 1.043 1.168 1.6 1.168 1.02 0 2.067-.282 2.232-2.423a6.2 6.2 0 0 0-1.528-.161"/>
            </svg>
            <span style={{ fontSize: 18, fontWeight: 'bold', color: '#000000', marginLeft: '4px' }}>@nwwonee</span>
          </div>

        </div>
      </div>
    ),
    { ...size }
  );
}