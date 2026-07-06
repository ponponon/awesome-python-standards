# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-07-06

### Added

- Time constants pattern (SECOND, MINUTE, HOUR, DAY, WEEK, MONTH)
- Redis multi-database separation pattern
- Redis rate limiter implementation
- Redis bloom filter pattern (set nx)
- API pagination response pattern (PaginatedResponse)
- String utility functions (weighted_length, remove_punctuation_space_and_emoji)
- Configuration mapping pattern (domain_mapping_parser_name etc.)
- CRUD operation encapsulation pattern

## [1.0.0] - 2026-07-06

### Added

- Initial release
- Python type hints best practices (Python 3.10+)
- Pydantic V2 data modeling patterns
- FastAPI development patterns
- ORM conventions (SQLModel, SQLAlchemy, Peewee)
- Project organization structure
- Code quality tools configuration (Ruff, mypy, pytest)
- Multi-platform support:
  - Claude Code
  - OpenCode
  - Codex CLI
  - Cursor
  - Gemini CLI
  - GitHub Copilot CLI
  - Factory Droid
  - Roo Code
  - TRAE
- CLI tool for easy installation
- npm package for distribution
