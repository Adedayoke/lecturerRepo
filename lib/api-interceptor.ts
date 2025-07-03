let isLoggedOut = false;

export const authFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  const response = await fetch(input, init);
  
  if ((response.status === 401 || response.status === 403) && !isLoggedOut) {
    // Only run on client side
    if (typeof window !== 'undefined') {
      const userInStorage = localStorage.getItem('user');
      
      if (userInStorage) {
        isLoggedOut = true;
        localStorage.removeItem('user');
        
        window.dispatchEvent(new CustomEvent('auth:logout'));
        
        // Redirect to login
        window.location.href = '/login?message=Session expired';
      }
    }
  }
  
  return response;
};
