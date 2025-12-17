# Contributing to Smiley Food App

Thank you for your interest in contributing to Smiley Food App! We welcome contributions from the community.

## 🤝 Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone.

## 📋 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce** the issue
- **Expected behavior** vs **actual behavior**
- **Screenshots** if applicable
- **Environment details** (OS, Node version, browser, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Clear title and description**
- **Use case** - why is this enhancement useful?
- **Possible implementation** - if you have ideas
- **Screenshots or mockups** if applicable

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Follow the coding style** used throughout the project
3. **Write clear commit messages**
4. **Update documentation** if needed
5. **Test your changes** thoroughly
6. **Submit a pull request**

## 🚀 Development Setup

1. **Clone your fork:**
   ```bash
   git clone https://github.com/your-username/smiley-food-app.git
   cd smiley-food-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   cd server && npm install && cd ..
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Set up the database:**
   ```bash
   createdb smiley
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```

## 📝 Coding Standards

### JavaScript/TypeScript

- Use **ES6+** features
- Follow **ESLint** configuration
- Use **meaningful variable names**
- Add **JSDoc comments** for functions
- Keep functions **small and focused**
- Use **async/await** over promises when possible

### React

- Use **functional components** with hooks
- Keep components **small and reusable**
- Use **TypeScript** for type safety
- Follow **React best practices**
- Use **proper prop types**

### CSS/Styling

- Use **Tailwind CSS** utility classes
- Follow **BEM naming** for custom classes
- Keep styles **consistent** across components
- Use **CSS variables** for theming

### Backend

- Follow **RESTful API** conventions
- Use **proper HTTP status codes**
- Add **input validation** on all endpoints
- Write **middleware** for reusable logic
- Add **error handling** everywhere
- Use **transactions** for database operations

## 🧪 Testing

- Write tests for new features
- Ensure existing tests pass
- Aim for good test coverage
- Test edge cases

```bash
npm test
```

## 📦 Commit Message Guidelines

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types:
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples:
```
feat(menu): add search functionality to menu page

fix(auth): resolve OTP verification timeout issue

docs(readme): update installation instructions

refactor(orders): simplify order status update logic
```

## 🔍 Pull Request Process

1. **Update documentation** with details of changes
2. **Update the README.md** if needed
3. **Ensure all tests pass**
4. **Request review** from maintainers
5. **Address review comments**
6. **Squash commits** if requested
7. **Merge** after approval

## 📚 Branch Naming

Use descriptive branch names:

- `feature/add-payment-gateway`
- `fix/order-status-bug`
- `docs/update-api-docs`
- `refactor/simplify-auth-flow`

## 🐛 Issue Labels

- **bug** - Something isn't working
- **enhancement** - New feature request
- **documentation** - Documentation improvements
- **good first issue** - Good for newcomers
- **help wanted** - Extra attention needed
- **priority: high** - High priority
- **priority: low** - Low priority

## 💡 Development Tips

### Database Changes

When making database schema changes:

1. Create a migration file
2. Test migration up and down
3. Update models accordingly
4. Document the changes

### API Changes

When modifying APIs:

1. Update API documentation
2. Maintain backward compatibility when possible
3. Version the API if breaking changes
4. Update client code accordingly

### Frontend Changes

1. Test on multiple browsers
2. Ensure responsive design
3. Check accessibility
4. Optimize performance
5. Update TypeScript types

## 🔒 Security

- **Never commit** sensitive data (API keys, passwords)
- **Use environment variables** for secrets
- **Validate all inputs** on the server
- **Sanitize user data** before display
- **Report security issues** privately to maintainers

## 📞 Getting Help

- **GitHub Issues** - For bugs and features
- **Discussions** - For questions and ideas
- **Email** - For sensitive issues

## 🎉 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

## ⚖️ License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Smiley Food App! 🙏
