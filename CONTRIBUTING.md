# Contributing to Slopwork Discord Bot

Thank you for considering contributing to the Slopwork Discord Bot! 🎉

## How to Contribute

### Reporting Bugs 🐛

1. Check if the bug has already been reported in [Issues](https://github.com/yourusername/slopwork-discord-bot/issues)
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Your environment (Node.js version, OS, etc.)
   - Screenshots if applicable

### Suggesting Features 💡

1. Check [Discussions](https://github.com/yourusername/slopwork-discord-bot/discussions) for similar ideas
2. Create a new discussion with:
   - Clear use case
   - Expected behavior
   - Why it would be useful
   - Implementation ideas (optional)

### Pull Requests 🔧

1. **Fork** the repository
2. **Create a branch** from `develop`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**:
   - Write clear, commented code
   - Follow existing code style
   - Test your changes thoroughly
4. **Commit** with clear messages:
   ```bash
   git commit -m "feat: add task filtering by type"
   ```
5. **Push** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
6. **Open a Pull Request** to the `develop` branch

### Commit Message Convention

We use semantic commit messages:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Test additions or changes
- `chore:` Build process or tooling changes

Examples:
```
feat: add webhook support for real-time updates
fix: resolve duplicate task posts
docs: update installation instructions
```

## Development Setup

1. **Clone your fork**:
   ```bash
   git clone https://github.com/YOUR-USERNAME/slopwork-discord-bot.git
   cd slopwork-discord-bot
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your test bot credentials
   ```

4. **Run tests**:
   ```bash
   npm test
   ```

5. **Start development server**:
   ```bash
   npm run dev
   ```

## Code Guidelines

### Style
- Use 2 spaces for indentation
- Use semicolons
- Use single quotes for strings
- Add comments for complex logic
- Keep functions small and focused

### Best Practices
- Handle errors gracefully
- Log important events
- Don't commit sensitive data
- Test edge cases
- Update documentation

### Testing
- Add tests for new features
- Ensure existing tests pass
- Test with real Discord bot

## Project Structure

```
slopwork-discord-bot/
├── bot.js              # Main bot logic
├── test.js             # Test suite
├── package.json        # Dependencies
├── .env.example        # Environment template
└── README.md          # Documentation
```

## Feature Ideas

Here are some areas where contributions would be valuable:

### High Priority
- [ ] API integration when available
- [ ] Webhook support for real-time updates
- [ ] Bid tracking and notifications
- [ ] Better error handling and retry logic

### Medium Priority
- [ ] Task filtering by category/type
- [ ] Multi-channel support
- [ ] Command interface (!tasks, !search)
- [ ] Database integration

### Nice to Have
- [ ] Web dashboard
- [ ] Analytics and statistics
- [ ] User preferences
- [ ] Internationalization (i18n)

## Questions?

- 💬 Ask in [Discussions](https://github.com/yourusername/slopwork-discord-bot/discussions)
- 📧 Open an issue for bugs
- 🌟 Star the repo to show support!

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing! 🙏
