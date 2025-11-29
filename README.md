# Ah Git — Here We Go Again

<div align="center">

![GitKon 2025 Game Jam Entry](https://img.shields.io/badge/GitKon-2025-blue)
![Built with chaos & caffeine in Kochi](https://img.shields.io/badge/Built%20with-chaos%20%26%20caffeine%20in%20Kochi-red)

**Break repos. Fix chaos. Learn Git — one disaster at a time.**

A chaotic educational Git survival adventure. Inspired by every developer who destroyed main on a Friday evening and regretted nothing.

[Features](#-features) • [Getting Started](#-getting-started) • [Game Modes](#-game-modes) • [Tech Stack](#-tech-stack) • [Project Structure](#-project-structure)

</div>

---

## 🎮 Overview

**Ah Git — Here We Go Again** (short: **Ah Git**) is an educational puzzle game that teaches Git version control through interactive gameplay. Whether you're a complete beginner or looking to sharpen your Git skills, this game provides hands-on experience with real Git commands in a safe, simulated environment.

Inspired by GTA San Andreas' iconic line "Ah shit, here we go again," this game brings humor, relatability, and developer pain & chaos to Git learning.

### What Makes It Special?

- **Real Git Commands**: Learn actual Git commands used in professional development
- **Interactive Learning**: Hands-on practice with immediate feedback and visualizations
- **Game Mechanics**: Boss battles, scoring, achievements, and time challenges
- **Progressive Difficulty**: Start with basics and advance to complex scenarios
- **Visual Timeline**: See your Git history come to life with animated visualizations
- **Free Sandbox**: Experiment freely without consequences

---

## ✨ Features

### 📚 Story Mode (Learn Git)

Master Git step-by-step through **5 cinematic acts**:

1. **Act 1: First Commit** - Learn the fundamentals of Git workflow

   - Understanding repositories
   - Making your first commit
   - Basic Git commands (`git init`, `git add`, `git commit`)

2. **Act 2: Branching** - Explore parallel development

   - Creating and switching branches
   - Branch management
   - Understanding branch workflows

3. **Act 3: Merge Conflicts** - Master conflict resolution

   - Understanding merge conflicts
   - Resolving conflicts manually
   - Merge strategies

4. **Act 4: Rebase** - Rewrite history safely

   - Interactive rebase
   - Rebasing vs merging
   - Timeline visualization

5. **Act 5: Cherry-Picking** - Selective commit application
   - Cherry-picking commits
   - When to use cherry-pick
   - Advanced Git workflows

**Features:**

- Step-by-step guided lessons
- Concept explanations with visual aids
- Timeline visualizations
- Real Git command execution
- Progress tracking
- Character-driven narrative

### 🎯 Disaster Arena (Challenge Mode)

Test your Git skills with **dynamic challenges**:

- **10 Randomized Challenges** per round
- **Time Pressure** - Solve quickly for bonus points
- **Scoring System**:
  - Base points for correct solutions
  - Time bonuses for fast completion
  - Hint penalties (hints cost points)
- **Real Scenarios**:
  - Fix broken repositories
  - Resolve merge conflicts
  - Restore lost commits
  - Fix branch issues
- **Progress Tracking**:
  - Score tracking
  - Attempt counting
  - Time remaining display

**Unlock Requirement**: Complete all 5 tutorial acts

### 🧪 Breakroom Lab (Sandbox Mode)

Free experimentation environment:

- **Full Git Simulation**:
  - Complete file system simulation
  - Commit history tracking
  - Branch management
  - Merge conflict simulation
- **Code Editor**:
  - Syntax highlighting (JavaScript, Python, JSON, HTML, CSS, C++)
  - File creation and editing
  - Real-time file updates
- **Timeline Visualizer**:
  - Interactive Git history graph
  - Branch visualization
  - Commit details
  - Animated transitions
- **Terminal Interface**:
  - Real Git command execution
  - Command history
  - Auto-completion suggestions
- **Supported Commands**:
  - `git init`, `git status`, `git add`, `git commit`
  - `git branch`, `git checkout`, `git switch`
  - `git merge`, `git rebase`, `git cherry-pick`
  - `git log`, `git diff`, `git reset`
  - `git stash`, `git tag`
  - File operations: `touch`, `echo`

**Unlock Requirement**: Complete Act 2

### 🎨 Visual Features

- **Animated Timeline**: See your Git history come to life
- **Branch Visualization**: Color-coded branches with clear labels
- **Commit Nodes**: Interactive commit circles with SHA and messages
- **Merge Animations**: Visual representation of merge operations
- **Conflict Visualization**: See merge conflicts in action
- **Progress Indicators**: Track your learning journey

### ⚙️ Settings & Preferences

- **Sound System**:
  - Enable/disable sounds
  - Volume control (0-100%)
  - Sound effects for Git operations
  - Victory and error sounds
- **Theme Preferences**:
  - Light/Dark mode support
  - System theme detection
- **Game Preferences**:
  - Hint preferences
  - Auto-advance settings
  - Difficulty selection

### 🎵 Sound System

The game includes a comprehensive sound system with 14 different sound effects:

- Core events: `success`, `error`, `notification`
- Git operations: `commit`, `branch`, `merge`, `rebase`, `cherry-pick`, `conflict`
- Timeline events: `pop`
- Victory/Defeat: `victory`, `defeat`
- UI interactions: `click`, `hover`

All sounds are optional and can be disabled via Settings.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ (recommended: use [nvm](https://github.com/nvm-sh/nvm))
- **npm** or **yarn** package manager

### Installation

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd git-resolve-adventure
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Start the development server**:

   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to `http://localhost:8080`

### Building for Production

```bash
npm run build
```

The production build will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

---

## 🎮 Game Modes

### 1. Story Mode (Tutorial Mode)

**Access**: Available from the start

**How to Play**:

1. Click "Start Story Mode" on the home screen
2. Follow the step-by-step lessons
3. Complete each act to unlock the next
4. Progress is automatically saved

**Features**:

- Guided lessons with explanations
- Interactive terminal for command practice
- Visual timeline showing Git operations
- Concept panels with detailed explanations
- Progress tracking across all acts

### 2. Disaster Arena (Challenge Mode)

**Access**: Unlocked after completing all 5 story acts

**How to Play**:

1. Click "Start Game" on the home screen
2. Read the game rules and instructions
3. Click "Start Game Round"
4. Solve 10 randomized challenges
5. Earn points based on speed and accuracy

**Scoring**:

- Base points for each challenge
- Time bonus for fast completion
- Hint penalty (using hints reduces score)
- Final score displayed at the end

**Tips**:

- Read scenarios carefully
- Use `git status` frequently
- Manage your time wisely
- Don't be afraid to experiment

### 3. Breakroom Lab (Sandbox Mode)

**Access**: Unlocked after completing Act 2

**How to Play**:

1. Click "Open Sandbox" on the home screen
2. Use the terminal to run Git commands
3. Edit files in the code editor
4. Watch the timeline update in real-time
5. Experiment freely!

**Features**:

- Start with empty repository or load sample repos
- Create files with `touch` or `echo` commands
- Full Git command support
- Syntax-highlighted code editor
- Interactive timeline visualizer

---

## 🛠️ Tech Stack

### Core Technologies

- **React 18.3** - UI framework
- **TypeScript 5.8** - Type safety
- **Vite 5.4** - Build tool and dev server
- **Tailwind CSS 3.4** - Styling
- **Framer Motion 12.23** - Animations

### UI Components

- **Radix UI** - Accessible component primitives
- **Shadcn/ui** - Pre-built component library
- **Lucide React** - Icon library
- **CodeMirror** - Code editor with syntax highlighting

### State Management

- **Zustand 5.0** - Lightweight state management
- **React Router 6.30** - Routing

### Additional Libraries

- **date-fns** - Date formatting
- **zod** - Schema validation
- **react-hook-form** - Form handling
- **sonner** - Toast notifications

---

## 📁 Project Structure

```
git-resolve-adventure/
├── public/
│   ├── sounds/              # Sound effects (14 files)
│   ├── keif-logo-*.png     # Character logos
│   └── favicon.ico
├── src/
│   ├── audio/
│   │   └── sounds.ts       # Sound manager and events
│   ├── components/
│   │   ├── common/         # Shared components
│   │   ├── concept/        # Concept panels
│   │   ├── editor/         # Code editor components
│   │   ├── terminal/       # Terminal components
│   │   ├── timeline/       # Timeline visualization
│   │   └── ui/             # UI components (shadcn)
│   ├── data/
│   │   ├── boss/           # Boss battle data
│   │   ├── challenges/     # Challenge pool
│   │   ├── conceptExplanations.ts
│   │   └── levels.ts
│   ├── game/
│   │   ├── acts/           # Tutorial acts (1-5)
│   │   ├── animations/    # Animation definitions
│   │   ├── boss/          # Boss battle system
│   │   ├── challenges/    # Game round system
│   │   ├── cinematic/    # Cinematic engine
│   │   ├── events/        # Event bus system
│   │   ├── lessonEngine/  # Lesson rendering engine
│   │   ├── lessons/       # Lesson JSON files
│   │   ├── logic/         # Git command logic
│   │   ├── puzzles/       # Puzzle rooms
│   │   ├── sandbox/       # Sandbox mode
│   │   └── state/         # State management
│   ├── hooks/             # Custom React hooks
│   ├── pages/             # Page components
│   ├── ui/                # UI system
│   └── utils/             # Utility functions
├── package.json
├── vite.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🎯 Supported Git Commands

### Basic Commands

- `git init` - Initialize a repository
- `git status` - Show working tree status
- `git add <file>` - Stage files
- `git commit -m "<message>"` - Create a commit
- `git log` - Show commit history
- `git diff` - Show changes

### Branching

- `git branch` - List/create branches
- `git branch <name>` - Create a branch
- `git checkout <branch>` - Switch branches
- `git switch <branch>` - Switch branches (newer syntax)
- `git checkout -b <name>` - Create and switch

### Merging & Rebasing

- `git merge <branch>` - Merge branches
- `git rebase <branch>` - Rebase onto branch
- `git cherry-pick <commit>` - Apply specific commit

### Advanced

- `git reset` - Reset HEAD
- `git stash` - Stash changes
- `git tag` - Create tags

### File Operations

- `touch <file>` - Create empty file
- `echo "content" > <file>` - Create file with content

---

## 🎨 Customization

### Adding Sound Files

Place sound files in `public/sounds/` directory. See `SOUND_FILES_REQUIRED.md` for the complete list of required sounds.

### Modifying Lessons

Lesson content is stored in JSON files under `src/game/lessons/`. Each act has its own JSON file with step-by-step instructions.

### Adding New Challenges

Challenges are defined in `src/data/challenges/challengePool.ts`. Add new challenge objects following the existing structure.

### Styling

The project uses Tailwind CSS. Customize colors and themes in `tailwind.config.ts` and `src/index.css`.

---

## 🐛 Troubleshooting

### Sound Files Not Playing

- Ensure sound files are in `public/sounds/` directory
- Check that sounds are enabled in Settings
- Verify file names match exactly (case-sensitive)
- Check browser console for errors

### Build Errors

- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear build cache: `rm -rf dist`
- Check Node.js version: `node --version` (should be 18+)

### Port Already in Use

Change the port in `vite.config.ts`:

```typescript
server: {
  port: 3000, // Change to your preferred port
}
```

---

## 📝 Development

### Code Style

- TypeScript strict mode enabled
- ESLint for code quality
- Prettier (if configured) for formatting

### Adding New Features

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes
3. Test thoroughly
4. Submit pull request

### Testing

Currently, manual testing is recommended. Future versions may include automated tests.

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📄 License

This project was created for the GitKon 2025 Game Jam.

---

## 🙏 Acknowledgments

- Built for **GitKon 2025 Game Jam**
- Made with ❤️ in **Kochi**
- Created by **GeorgeET15** - [georgeemmanuelthomas.dev](https://georgeemmanuelthomas.dev)
- Inspired by the need for better Git education tools

---

## 📞 Support

For issues, questions, or suggestions:

- Open an issue on GitHub
- Check existing issues for solutions
- Review the documentation

---

<div align="center">

**Built with chaos & caffeine in Kochi**

Break repos. Fix chaos. Learn Git — one disaster at a time.

</div>
