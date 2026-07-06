# Installing Awesome Python Standards for OpenCode

## Prerequisites

- [OpenCode.ai](https://opencode.ai) installed

## Installation

Add awesome-python-standards to the `plugin` array in your `opencode.json` (global or project-level):

```json
{
  "plugin": ["awesome-python-standards@git+https://github.com/ponponon/awesome-python-standards.git"]
}
```

Restart OpenCode. The plugin installs through OpenCode's plugin manager and registers all skills.

Verify by asking: "Python 后端开发的最佳实践是什么？"

## Usage

Use OpenCode's native `skill` tool:

```
use skill tool to list skills
use skill tool to load awesome-python-standards/awesome-python-standards
```

## Updating

OpenCode installs the skill through a git-backed package spec. If updates do not appear, clear OpenCode's package cache or reinstall the plugin.

To pin a specific version:

```json
{
  "plugin": ["awesome-python-standards@git+https://github.com/ponponon/awesome-python-standards.git#v1.0.0"]
}
```

## Troubleshooting

### Plugin not loading

1. Check logs: `opencode run --print-logs "hello" 2>&1 | grep -i awesome-python`
2. Verify the plugin line in your `opencode.json`
3. Make sure you're running a recent version of OpenCode

### Skills not found

1. Use `skill` tool to list what's discovered
2. Check that the plugin is loading (see above)

## Getting Help

- Report issues: https://github.com/ponponon/awesome-python-standards/issues
