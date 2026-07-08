# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.1] - 2026-07-08

### Changed

- CLI now directly installs skill by cloning to appropriate directory
- No more manual copy-paste instructions

## [1.1.0] - 2026-07-08

### Changed

- Updated CLI installation instructions for all platforms
- OpenCode: Added skill directory installation option (recommended)
- Claude Code: Added skill directory installation option
- Cursor: Added skill directory installation option
- Gemini: Added skill directory installation option

## [1.0.2] - 2026-07-08

### Fixed

- Fix CLI init command TypeError when selecting platform
- Correct prompts select return value handling (returns choice value, not index)

## [1.0.1] - 2026-07-08

### Added

- Module import specification: module, library, package concepts explanation
- Current path vs import path relationship documentation
- ModuleNotFoundError root cause analysis and solutions
- Best practices for running scripts with `-m` parameter
- PYTHONPATH environment variable usage guide
- Virtual environment import path troubleshooting

## [1.0.0] - 2026-07-06

### Added

- Initial release of awesome-python-standards skill
- Type hints best practices (modern Python 3.10+ syntax without `typing.Optional`)
- Pydantic V2 data validation and `Field(..., description)` rules
- Virtual environment best practices (Pipenv, venv, Poetry)
- FastAPI endpoints metadata standards (class description, router tags, summary)
- Loguru logging configuration
- CLI installation tool support
- Fully generic and open-source ready
