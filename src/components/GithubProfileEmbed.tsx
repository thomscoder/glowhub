import { useEffect } from 'react';
import { Scene } from './Scene';

interface GithubProfileEmbedProps {
  username?: string;
  year?: string;
  theme?: 'green' | 'orange' | 'purple';
}

export const GithubProfileEmbed = ({ username = 'thomscoder' }: GithubProfileEmbedProps) => {
  useEffect(() => {
    // Allow iframe resizing messages from parent
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'resize') {
        // Handle any resize events if needed
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      position: 'fixed',
      top: 0,
      left: 0,
      overflow: 'hidden'
    }}>
      <Scene _username={username} />
    </div>
  );
};
