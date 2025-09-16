# Contributing to Smiley Food App

Thank you for your interest in contributing to Smiley Food App! 🎉 We're excited to have you as part of our community.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Contribution Types](#contribution-types)
- [Style Guidelines](#style-guidelines)
- [Testing Guidelines](#testing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)
- [Community](#community)

## 🤝 Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct:

- **Be respectful**: Treat everyone with respect and kindness
- **Be inclusive**: Welcome newcomers and help them learn
- **Be collaborative**: Work together towards common goals
- **Be patient**: Remember that everyone has different skill levels
- **Be constructive**: Provide helpful feedback and suggestions

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL (v12 or higher)
- Git
- Basic knowledge of React, TypeScript, and Express.js

### Setup Development Environment

1. **Fork the repository**
   ```bash
   # Click the "Fork" button on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/Smiley.git
   cd Smiley
   ```

2. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/Diwakar-odds/Smiley.git
   ```

3. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   cd server && npm install && cd ..
   ```

4. **Set up environment variables**
   - Copy `.env.example` to `.env` (create these files based on README.md)
   - Configure your database connection
   - Set up any required API keys

5. **Start development servers**
   ```bash
   npm run dev
   ```

## 🔄 Development Workflow

### Branch Naming Convention
- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring
- `test/description` - Adding tests
- `chore/description` - Maintenance tasks

### Example Workflow
```bash
# 1. Sync with upstream
git checkout main
git pull upstream main

# 2. Create feature branch
git checkout -b feature/add-search-functionality

# 3. Make changes and commit
git add .
git commit -m "feat: add search functionality to menu"

# 4. Push to your fork
git push origin feature/add-search-functionality

# 5. Create Pull Request on GitHub
```

## 🎯 Contribution Types

### 🐛 Bug Fixes
- Check existing issues before creating new ones
- Provide clear reproduction steps
- Include screenshots/videos if applicable
- Test your fix thoroughly

### ✨ New Features
- Discuss feature ideas in issues first
- Follow existing patterns and conventions
- Add appropriate tests
- Update documentation

### 📚 Documentation
- Fix typos and improve clarity
- Add examples and use cases
- Keep documentation up-to-date with code changes
- Use clear and concise language

### 🧪 Testing
- Write unit tests for new functions/components
- Add integration tests for API endpoints
- Ensure all tests pass before submitting
- Aim for good test coverage

### 🎨 UI/UX Improvements
- Follow existing design patterns
- Ensure responsive design
- Test on multiple devices/browsers
- Consider accessibility standards

## 📝 Style Guidelines

### TypeScript/JavaScript
```typescript
// ✅ Good - Use interfaces for object types
interface User {
  id: number;
  name: string;
  email: string;
}

// ✅ Good - Use descriptive function names
const fetchUserById = async (id: number): Promise<User> => {
  // implementation
};

// ✅ Good - Use proper error handling
try {
  const user = await fetchUserById(1);
  return user;
} catch (error) {
  console.error('Failed to fetch user:', error);
  throw error;
}
```

### React Components
```tsx
// ✅ Good - Functional components with TypeScript
interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary',
  disabled = false 
}) => {
  return (
    <button
      className={`btn btn-${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
```

### CSS/Tailwind
```tsx
// ✅ Good - Use Tailwind classes consistently
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
  <h2 className="text-xl font-semibold text-gray-800">Title</h2>
  <button className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
    Action
  </button>
</div>
```

### Commit Messages
Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat: add search functionality to menu items
fix: resolve cart calculation bug
docs: update installation instructions
test: add unit tests for auth service
```

## 🧪 Testing Guidelines

### Running Tests
```bash
# Run all tests (when implemented)
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Writing Tests
```typescript
// Example unit test
describe('calculateTotal', () => {
  it('should calculate correct total with tax', () => {
    const items = [
      { price: 10, quantity: 2 },
      { price: 5, quantity: 1 }
    ];
    const result = calculateTotal(items, 0.1); // 10% tax
    expect(result).toBe(27.5); // (20 + 5) * 1.1
  });
});

// Example component test
describe('Button Component', () => {
  it('should call onClick when clicked', () => {
    const mockClick = jest.fn();
    render(<Button onClick={mockClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(mockClick).toHaveBeenCalledTimes(1);
  });
});
```

## 📬 Pull Request Process

### Before Submitting
- [ ] Code follows style guidelines
- [ ] All tests pass
- [ ] Documentation is updated
- [ ] Commit messages follow convention
- [ ] No merge conflicts with main branch

### PR Template
```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] Added new tests for features
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots or GIFs showing the changes.

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

### Review Process
1. **Automated checks** - All CI checks must pass
2. **Code review** - At least one maintainer review
3. **Testing** - Manual testing if required
4. **Approval** - PR approved by maintainer
5. **Merge** - Squash and merge to main

## 🐛 Issue Guidelines

### Bug Reports
```markdown
**Bug Description**
A clear description of the bug.

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What should happen.

**Actual Behavior**
What actually happens.

**Screenshots**
Add screenshots if applicable.

**Environment**
- OS: [e.g., macOS, Windows, Linux]
- Browser: [e.g., Chrome, Firefox, Safari]
- Version: [e.g., 1.0.0]
```

### Feature Requests
```markdown
**Feature Description**
A clear description of the feature.

**Problem Statement**
What problem does this solve?

**Proposed Solution**
How should this feature work?

**Alternatives Considered**
Other solutions you've considered.

**Additional Context**
Any other relevant information.
```

## 💬 Community

### Getting Help
- 📖 Check the [README](README.md) first
- 🔍 Search existing [issues](https://github.com/Diwakar-odds/Smiley/issues)
- 💬 Create a new issue for questions
- 📧 Contact maintainers if needed

### Recognition
Contributors will be recognized in:
- README.md contributors section
- Release notes for significant contributions
- GitHub contributors graph

## 🎉 First-Time Contributors

New to open source? Here are some beginner-friendly ways to start:

1. **Documentation**: Fix typos, improve explanations
2. **Small bug fixes**: Look for `good first issue` labels
3. **Code review**: Review other contributors' PRs
4. **Testing**: Add tests for existing functionality
5. **UI improvements**: Enhance styling and accessibility

### Good First Issues
Look for issues labeled:
- `good first issue` - Perfect for newcomers
- `help wanted` - We'd love community help
- `documentation` - Documentation improvements
- `beginner friendly` - Easy to get started

## 📞 Questions?

Don't hesitate to ask questions! We're here to help:

- Create an issue with the `question` label
- Mention maintainers in discussions
- Be specific about what you need help with

---

**Thank you for contributing to Smiley Food App! 🚀😊**

Every contribution, no matter how small, makes a difference. Let's build something amazing together!