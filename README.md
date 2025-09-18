# ShipShipShip Template - Default

A beautiful changelog template for ShipShipShip, displaying your product updates like light through a prism.

## Features

- 🎨 Modern, responsive design
- 🔍 Search and filtering capabilities
- 📧 Newsletter subscription
- 🗳️ User voting on features
- 💬 Feedback collection
- 🏷️ Tag-based organization
- 🎯 Event status tracking (Backlogs, Proposed, Upcoming, Release, Archived)

## Template System Architecture

This template is designed to be built and served by your ShipShipShip Go backend. The architecture is:

1. **Go backend** downloads/clones this template
2. **Go backend** runs `npm run build`
3. **Go backend** serves the built static files
4. **Frontend** makes API calls to `/api/*` (same origin - no CORS issues)

### Environment Configuration (Optional)

For **development only**, you can optionally configure:

```bash
# Development: Point to your Go backend during frontend development
VITE_ADMIN_API_URL=http://localhost:8080
```

### Configuration Examples

#### Production (Template System) - Default
```bash
# No configuration needed!
# Frontend served by Go backend on same origin
# API calls are relative: /api/events, /api/settings, etc.
```

#### Development Only
```bash
# Frontend dev server connecting to Go backend
VITE_ADMIN_API_URL=http://localhost:8080
```

### Configuration Status

In development mode, you'll see a configuration status indicator in the bottom-right corner showing:
- Current API URL
- Authentication method (server-side secure)
- Connection mode (Local/External)

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Authentication

Authentication is handled entirely by your ShipShipShip Go backend. The frontend template:

- Makes **relative API calls** (`/api/events`, `/api/settings`)
- **No authentication logic** needed in frontend
- **No JWT tokens** or credentials in frontend code
- Go backend handles all security, sessions, and API authentication

This is secure because:
- Frontend and backend are served from the same origin
- Go backend controls all API access
- No sensitive credentials exposed to browser
- Standard web application security model

## Deployment

This template is designed to be **built and served by your ShipShipShip Go backend**:

1. Go backend clones this template repository
2. Runs `npm install && npm run build`
3. Serves the `build/` directory as static files
4. Handles API routes on the same server

**Note**: This is not deployed separately to Vercel/Netlify. It's bundled with your Go application as a template.

## Customization

The template uses:
- **SvelteKit** for the framework
- **Tailwind CSS** for styling
- **Lucide** for icons
- **TypeScript** for type safety

You can customize colors, fonts, and layout by editing the Tailwind configuration and component files.

## API Integration

The template makes relative API calls to your Go backend:

- `GET /api/events` - Public changelog viewing
- `POST /api/events/{id}/vote` - Event voting
- `POST /api/newsletter/subscribe` - Newsletter subscriptions
- `POST /api/feedback` - Feedback submission
- `GET /api/tags` - Tag filtering
- And more...

### Template System Benefits

- **Same-origin requests**: No CORS complexity
- **Secure by design**: Go backend controls all access
- **Simple deployment**: Single application bundle
- **Template flexibility**: Easy to customize themes
- **Zero configuration**: Works out of the box

## License

This template is part of the ShipShipShip project.
