interface GoogleAuth {
  access_token: string;
  expires_at: number;
}

export class GoogleDriveSync {
  private clientId: string;
  private redirectUri: string;
  private auth: GoogleAuth | null = null;
  
  constructor() {
    this.clientId = import.meta.env.PUBLIC_GOOGLE_CLIENT_ID || '';
    this.redirectUri = import.meta.env.PUBLIC_REDIRECT_URI || (typeof window !== 'undefined' ? window.location.origin : '');
    
    // Load auth from localStorage (only in browser)
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('googleAuth');
      if (stored) {
        try {
          this.auth = JSON.parse(stored);
          if (this.auth && this.auth.expires_at < Date.now()) {
            this.auth = null;
            localStorage.removeItem('googleAuth');
          }
        } catch (e) {
          console.error('Failed to load auth:', e);
        }
      }
    }
  }
  
  get isAuthenticated() {
    return this.auth !== null && this.auth.expires_at > Date.now();
  }
  
  async authenticate() {
    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authUrl.searchParams.set('client_id', this.clientId);
    authUrl.searchParams.set('redirect_uri', this.redirectUri);
    authUrl.searchParams.set('response_type', 'token');
    authUrl.searchParams.set('scope', 'https://www.googleapis.com/auth/drive.file');
    authUrl.searchParams.set('access_type', 'online');
    
    // Open auth window
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    
    const authWindow = window.open(
      authUrl.toString(),
      'google-auth',
      `width=${width},height=${height},left=${left},top=${top}`
    );
    
    // Wait for auth completion
    return new Promise<boolean>((resolve) => {
      const checkInterval = setInterval(() => {
        try {
          if (authWindow?.closed) {
            clearInterval(checkInterval);
            // Check if we got the token
            const hash = new URLSearchParams(window.location.hash.substring(1));
            const accessToken = hash.get('access_token');
            const expiresIn = hash.get('expires_in');
            
            if (accessToken && expiresIn) {
              this.auth = {
                access_token: accessToken,
                expires_at: Date.now() + parseInt(expiresIn) * 1000
              };
              if (typeof localStorage !== 'undefined') {
                localStorage.setItem('googleAuth', JSON.stringify(this.auth));
              }
              // Clear the hash
              window.location.hash = '';
              resolve(true);
            } else {
              resolve(false);
            }
          }
        } catch (e) {
          // Cross-origin error is expected
        }
      }, 100);
    });
  }
  
  async saveData(data: any) {
    if (!this.isAuthenticated) throw new Error('Not authenticated');
    
    const fileName = 'habit-week-data.json';
    
    try {
      // First, try to find existing file
      const searchResponse = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=name='${fileName}'&spaces=appDataFolder`,
        {
          headers: {
            'Authorization': `Bearer ${this.auth!.access_token}`
          }
        }
      );
      
      const searchData = await searchResponse.json();
      const existingFile = searchData.files?.[0];
      
      const metadata = {
        name: fileName,
        mimeType: 'application/json',
        parents: existingFile ? undefined : ['appDataFolder']
      };
      
      const form = new FormData();
      form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      form.append('media', new Blob([JSON.stringify(data)], { type: 'application/json' }));
      
      const url = existingFile
        ? `https://www.googleapis.com/upload/drive/v3/files/${existingFile.id}?uploadType=multipart`
        : 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';
      
      const method = existingFile ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${this.auth!.access_token}`
        },
        body: form
      });
      
      if (!response.ok) {
        throw new Error(`Failed to save: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Save error:', error);
      throw error;
    }
  }
  
  async loadData() {
    if (!this.isAuthenticated) throw new Error('Not authenticated');
    
    const fileName = 'habit-week-data.json';
    
    try {
      // Find the file
      const searchResponse = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=name='${fileName}'&spaces=appDataFolder`,
        {
          headers: {
            'Authorization': `Bearer ${this.auth!.access_token}`
          }
        }
      );
      
      const searchData = await searchResponse.json();
      const file = searchData.files?.[0];
      
      if (!file) {
        return null; // No data yet
      }
      
      // Download the file content
      const contentResponse = await fetch(
        `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`,
        {
          headers: {
            'Authorization': `Bearer ${this.auth!.access_token}`
          }
        }
      );
      
      if (!contentResponse.ok) {
        throw new Error(`Failed to load: ${contentResponse.statusText}`);
      }
      
      return await contentResponse.json();
    } catch (error) {
      console.error('Load error:', error);
      throw error;
    }
  }
  
  logout() {
    this.auth = null;
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('googleAuth');
    }
  }
}

export const googleDrive = new GoogleDriveSync();