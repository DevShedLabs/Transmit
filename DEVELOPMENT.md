# Transmit Development Documentation

## Project Architecture

### Core Components

The application is structured into several key components:

```
src/
  components/
    Transmit/
      context/          # React contexts
      dialogs/          # Modal dialogs
      hooks/            # Custom React hooks
      RequestPanel/     # Request configuration
      ResponsePanel/    # Response display
      sidebars/        # Collections and history
      utils/           # Utility functions
```

### Key Components

1. `RequestPanel/`
    - URL input and method selection
    - Configuration tabs for headers, params, etc.
    - Request sending controls

2. `ResponsePanel/`
    - Response body display
    - Headers and cookies viewing
    - Response metrics

3. `sidebars/`
    - Collections management
    - Request history
    - Navigation

### State Management

- Uses React's built-in state management with hooks
- Local storage for persistence
- Custom hooks for shared functionality:
    - `useRequest`: Request handling
    - `useStorage`: Storage management
    - `useTransmitState`: Application state

### Storage System

The storage system is built around `storageManager.js` which provides:

- Collection management
- History tracking
- Workspace state
- Settings storage

## Customization Guide

### Adding New Authentication Methods

1. Update `types/index.ts`:
```typescript
export interface Auth {
  type: 'none' | 'basic' | 'bearer' | 'apiKey' | 'your-new-type';
  // Add new type-specific fields
}
```

2. Modify `RequestPanel/ConfigTabs/Auth.jsx`:
- Add new type to options
- Create form fields for new auth type
- Update state handling

### Custom Request Processing

Modify `utils/request.js` to add pre-request processing:

```javascript
export const executeRequest = async (request, environment) => {
  // Add custom processing here
  const processedRequest = await customProcess(request);
  // Continue with request execution
};
```

### Response Transformations

Extend `ResponsePanel/ResponseBody.jsx` for custom formatting:

```javascript
const formatContent = (content) => {
  // Add custom formatting logic
  if (isCustomFormat(content)) {
    return formatCustomContent(content);
  }
  return defaultFormat(content);
};
```

### Adding New Configuration Tabs

1. Create new tab component in `RequestPanel/ConfigTabs/`
2. Update `ConfigTabs/index.jsx`:
```javascript
const tabs = [
  // ... existing tabs
  { id: 'newTab', label: 'New Tab' }
];
```

3. Add tab content rendering

### Styling Customization

1. Core styles are in `index.css`
2. Component-specific styles use Bootstrap classes
3. Modify theme variables in `styles/`:
```css
:root {
  --primary-color: #your-color;
  --secondary-color: #your-color;
  /* Add custom variables */
}
```

## Testing

### Unit Tests

```bash
npm run test
```

Key test areas:
- Request processing
- Storage operations
- Component rendering
- State management

### E2E Tests

```bash
npm run test:e2e
```

Tests cover:
- Request flow
- Collection management
- Response handling

## Performance Considerations

- Large response handling
- History size management
- Storage limitations
- Request timeouts

## Security Best Practices

1. Proxy Configuration
```php
// In proxy.php
header('Access-Control-Allow-Origin: your-domain.com');
// Add appropriate security headers
```

2. Data Sanitization
```javascript
// Always sanitize user input
const sanitizeInput = (input) => {
  // Add sanitization logic
  return sanitized;
};
```

3. Error Handling
```javascript
try {
  // Sensitive operations
} catch (error) {
  // Secure error handling
  secureErrorLog(error);
}
```

## Build and Deployment

### Production Build

```bash
npm run build
```

Outputs:
- Minified JavaScript
- Optimized assets
- Source maps (optional)

### Deployment Configuration

1. Environment Variables
```env
VITE_API_URL=your-api-url
VITE_PROXY_URL=your-proxy-url
```

2. Server Configuration
```nginx
# Example Nginx configuration
location /api {
  proxy_pass http://your-proxy;
}
```

## Troubleshooting

Common issues and solutions:

1. CORS Errors
- Check proxy configuration
- Verify allowed origins
- Ensure headers are set correctly

2. Storage Issues
- Clear local storage
- Check quota limits
- Verify data structure

3. Request Failures
- Verify proxy setup
- Check network connectivity
- Validate request format