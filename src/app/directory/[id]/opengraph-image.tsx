import { ImageResponse } from 'next/og';
import { fetchGithubReposData } from "@/services/githubRepoService";

export const alt = 'Repository Details';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Image({ params }: Props) {
  const resolvedParams = await params;
  const reposData = await fetchGithubReposData();
  const repo = reposData.find((t) => t._id.toString() === resolvedParams.id);

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

  let stars = 0;
  let forks = 0;
  let language = 'Multiple';
  try {
    const res = await fetch(`https://api.github.com/repos/${repo.owner}/${repo.repo_name}`, {
      next: { revalidate: 86400 }
    });
    if (res.ok) {
      const data = await res.json();
      stars = data.stargazers_count || 0;
      forks = data.forks_count || 0;
      language = data.language || 'Multiple';
    }
  } catch (e) {
  }

  return new ImageResponse(
    (
      <div
        style={{
          background: '#111827',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            background: '#1a1f35',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '24px',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '60px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.25)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <img
                src={`https://github.com/${repo.owner}.png`}
                alt="avatar"
                width={80}
                height={80}
                style={{ borderRadius: '50%' }}
              />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 24, color: 'rgba(255, 255, 255, 0.7)' }}>
                  {repo.owner}
                </span>
                <span style={{ fontSize: 48, fontWeight: 'bold', color: '#ffffff' }}>
                  {repo.name}
                </span>
              </div>
            </div>
            
            <p style={{ 
              fontSize: 32, 
              color: 'rgba(255, 255, 255, 0.8)',
              marginTop: '30px',
              lineHeight: 1.4,
            }}>
              {repo.description && repo.description.length > 150 
                ? repo.description.slice(0, 150) + '...'
                : repo.description}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '40px', marginTop: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(255, 255, 255, 0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span style={{ fontSize: 28, color: 'rgba(255, 255, 255, 0.7)' }}>Stars</span>
              <span style={{ fontSize: 32, fontWeight: 'bold', color: '#ffffff' }}>{stars.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(255, 255, 255, 0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="18" r="3"></circle>
                <circle cx="6" cy="6" r="3"></circle>
                <circle cx="18" cy="6" r="3"></circle>
                <path d="M18 9v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9"></path>
                <path d="M12 12v3"></path>
              </svg>
              <span style={{ fontSize: 28, color: 'rgba(255, 255, 255, 0.7)' }}>Forks</span>
              <span style={{ fontSize: 32, fontWeight: 'bold', color: '#ffffff' }}>{forks.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(255, 255, 255, 0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6"></polyline>
                <polyline points="8 6 2 12 8 18"></polyline>
              </svg>
              <span style={{ fontSize: 28, color: 'rgba(255, 255, 255, 0.7)' }}>Lang</span>
              <span style={{ fontSize: 32, fontWeight: 'bold', color: '#ffffff' }}>{language}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: 'auto' }}>
              <span style={{ 
                background: 'rgba(59, 130, 246, 0.1)', 
                color: '#60a5fa', 
                padding: '8px 24px', 
                borderRadius: '999px',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                fontSize: 24
              }}>
                {repo.category}
              </span>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}