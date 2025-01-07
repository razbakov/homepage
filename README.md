# WebCraft AI Team

A specialized AI team system for website development and design in Cursor IDE, featuring expert roles covering all aspects of web creation - from UX/UI design to technical implementation and project management.

🚀 **Get your website from concept to deployment in 30 minutes!** Our AI-powered team system handles everything - concept development, design, programming, and SEO-optimized content creation, delivering production-ready websites at unprecedented speed.

⏱️ **Traditional website development takes 3 days:**

- 1 day for research and design
- 1 day for programming
- 1 day for content creation

We compress this entire process into just 30 minutes without compromising quality.

## Overview

This project implements a multi-role AI system where different AI personas provide specialized expertise and support. The system includes roles such as Secretary, UX Expert, UI Designer, Project Manager, Technical Lead, and Career Coach, each with their own areas of expertise and communication styles.

## Features

- **Role-Based Interactions**: Switch between different AI roles using `/switch [role]` command
- **Task Management**: Create and track tasks with `/task` and `/complete` commands
- **Project Documentation**: Generate specialized documentation with `/doc` command
- **Daily Routines**: Structured daily check-ins and wrap-ups
- **Emergency Protocols**: Handle urgent issues and technical problems

## Available Roles

- **Secretary (Sarah)**: Organization and task management
- **UX Expert (Alex)**: User experience and interaction design
- **UI Designer (Maya)**: Visual design and brand identity
- **Project Manager (Tom)**: Project planning and coordination
- **Technical Lead (Dev)**: Development architecture and technical guidance
- **Career Coach (Claire)**: Career development and professional growth

## Usage

1. **Start of Day**:

   - Greet with "Good morning" or "Hello"
   - AI defaults to Secretary role
   - Get daily context and priorities

2. **Role Switching**:

   ```
   /switch [role]  # Example: /switch ux
   ```

3. **Task Management**:

   ```
   /task [description]     # Create new task
   /complete [task]        # Mark task as done
   ```

4. **Documentation**:

   ```
   /doc [type]            # Request specific documentation
   ```

5. **End of Day**:
   ```
   /end                   # Get daily summary and prepare for next day
   ```

## Project Structure

- `.cursorrules` - Main configuration file
- `.backlog/` - Project backlog and tasks
- `docs/`
  - `decisions/` - Architectural decision records
  - `backlog/` - Task tracking
  - `tech-debt.md` - Technical debt tracking

## Best Practices

- One question at a time approach
- Context-aware responses
- Role-specific expertise
- Clear documentation
- Conventional commit messages

## Contributing

When adding new rules or behaviors:

1. Use "rule: xxx" to add new behaviors
2. Follow the existing structure
3. Update documentation accordingly

## Version Control

- Use "save" command to commit changes
- Follow conventional commits format
- Maintain detailed changelog through git history
