# Project Management System

A modern project management system built with React, TypeScript, and Tailwind CSS.

## Features

- Project creation and management
- Milestone tracking
- Deliverable management with drag-and-drop functionality
- Real-time updates
- Responsive design
- Accessibility support
- Error handling

## Project Structure

```
src/
├── components/
│   ├── common/           # Shared components
│   ├── project/          # Project-related components
│   │   └── creation/     # Project creation components
│   └── dashboard/        # Dashboard components
├── hooks/                # Custom React hooks
├── types/                # TypeScript type definitions
└── utils/                # Utility functions
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/project-management.git
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## Component Documentation

### DeliverableItem

A component that displays and allows editing of a single deliverable item.

```tsx
<DeliverableItem
  provided={draggableProvided}
  deliverable={deliverableData}
  onUpdate={handleUpdate}
  onDelete={handleDelete}
/>
```

### DeliverableList

A component that displays a list of deliverables with drag and drop functionality.

```tsx
<DeliverableList
  milestoneId="milestone-1"
  deliverables={deliverablesData}
  onAdd={handleAdd}
  onUpdate={handleUpdate}
  onDelete={handleDelete}
  onReorder={handleReorder}
/>
```

## Development

### Code Style

- Follow TypeScript best practices
- Use functional components with hooks
- Implement proper error handling
- Ensure accessibility compliance
- Write clean, documented code

### Testing

The project uses real data testing instead of unit tests. This approach:
- Tests components with actual database data
- Verifies real user interactions
- Ensures data persistence
- Tests error handling with real API responses

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
