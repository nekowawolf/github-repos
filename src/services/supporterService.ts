import { Supporter } from '@/types/supporter';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchSupportersData(): Promise<Supporter[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/supporters`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const rawData = await response.json();
    return Array.isArray(rawData) ? rawData : rawData?.data || [];
  } catch (error) {
    console.error("Failed to fetch supporters:", error);
    return [];
  }
}

export async function submitSupportRequest(
  name: string,
  url: string,
  platform: string,
  turnstileToken: string
): Promise<any> {
  const payload = {
    name,
    url,
    platform,
    turnstile_token: turnstileToken
  };

  const response = await fetch(`${API_BASE_URL}/support-requests`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to submit support request');
  }

  return response.json();
}