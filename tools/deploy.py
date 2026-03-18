#!/usr/bin/env python3
"""Build and deploy all decks to GitHub Pages in one command.

Usage:
  python tools/deploy.py                      # auto-detect repo name
  python tools/deploy.py --base /slide-maker  # explicit base path
  python tools/deploy.py --dry-run            # build only, don't push
"""

import argparse
import os
import re
import shutil
import subprocess
import sys


def get_repo_root():
    """Find the git repository root."""
    script_dir = os.path.dirname(os.path.abspath(__file__))
    return os.path.dirname(script_dir)


def detect_repo_name(repo_root):
    """Detect the repository name from git remote origin URL."""
    try:
        result = subprocess.run(
            ["git", "remote", "get-url", "origin"],
            cwd=repo_root,
            capture_output=True,
            text=True,
            check=True,
        )
        url = result.stdout.strip()
    except (subprocess.CalledProcessError, FileNotFoundError):
        return None

    if not url:
        return None

    # Handle SSH: git@github.com:user/repo.git
    # Handle HTTPS: https://github.com/user/repo.git
    match = re.search(r"[/:]([^/:]+?)(?:\.git)?$", url)
    if match:
        return match.group(1)
    return None


def run(cmd, cwd=None, env=None, check=True):
    """Run a command, printing it first."""
    if isinstance(cmd, list):
        display = " ".join(cmd)
    else:
        display = cmd
    print(f"  $ {display}")
    return subprocess.run(
        cmd, cwd=cwd, env=env, check=check,
        shell=isinstance(cmd, str),
    )


def main():
    parser = argparse.ArgumentParser(
        description="Build and deploy all decks to GitHub Pages.",
        epilog="Examples:\n"
               "  python tools/deploy.py\n"
               "  python tools/deploy.py --base /slide-maker\n"
               "  python tools/deploy.py --dry-run\n",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument(
        "--base",
        default=None,
        help="Base path for GitHub Pages (e.g. /slide-maker). "
             "Auto-detected from git remote if not provided.",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Build only, don't push to gh-pages",
    )
    parser.add_argument(
        "--branch",
        default="gh-pages",
        help="Remote branch to deploy to (default: gh-pages)",
    )
    args = parser.parse_args()

    repo_root = get_repo_root()
    examples_dir = os.path.join(repo_root, "examples")
    build_script = os.path.join(examples_dir, "build.sh")
    build_dir = os.path.join(examples_dir, "_build")

    if not os.path.isfile(build_script):
        print(f"Error: build script not found: {build_script}", file=sys.stderr)
        sys.exit(1)

    # Determine base path
    if args.base:
        base = args.base
    else:
        repo_name = detect_repo_name(repo_root)
        if not repo_name:
            print(
                "Error: could not detect repo name from git remote.\n"
                "Provide --base explicitly, e.g.: python tools/deploy.py --base /slide-maker",
                file=sys.stderr,
            )
            sys.exit(1)
        base = f"/{repo_name}"

    print(f"Base path: {base}")
    print()

    # Step 1: Build
    print("=== Building all decks ===")
    build_env = os.environ.copy()
    build_env["BASE_PREFIX"] = base
    result = run(
        ["bash", build_script],
        cwd=repo_root,
        env=build_env,
        check=False,
    )
    if result.returncode != 0:
        print("\nError: build failed", file=sys.stderr)
        sys.exit(1)

    if not os.path.isdir(build_dir):
        print(f"\nError: build output not found: {build_dir}", file=sys.stderr)
        sys.exit(1)

    print()
    print("Build complete.")

    if args.dry_run:
        print()
        print(f"[dry-run] Build output is in: {build_dir}")
        print("[dry-run] Skipping deploy. Re-run without --dry-run to push to gh-pages.")
        return

    # Step 2: Deploy to gh-pages
    print()
    print(f"=== Deploying to {args.branch} branch ===")

    # Get remote URL from parent repo
    try:
        result = subprocess.run(
            ["git", "remote", "get-url", "origin"],
            cwd=repo_root,
            capture_output=True,
            text=True,
            check=True,
        )
        remote_url = result.stdout.strip()
    except subprocess.CalledProcessError:
        print("Error: could not get git remote URL", file=sys.stderr)
        sys.exit(1)

    # Remove any existing .git in build dir (from previous runs)
    git_dir = os.path.join(build_dir, ".git")
    if os.path.isdir(git_dir):
        shutil.rmtree(git_dir)

    # Initialize a temp git repo in the build dir
    run(["git", "init"], cwd=build_dir)
    run(["git", "checkout", "-b", args.branch], cwd=build_dir)
    run(["git", "add", "-A"], cwd=build_dir)
    run(["git", "commit", "-m", "Deploy to GitHub Pages"], cwd=build_dir)
    run(["git", "remote", "add", "origin", remote_url], cwd=build_dir)

    print()
    print(f"Pushing to origin/{args.branch}...")
    result = run(
        ["git", "push", "-f", "origin", args.branch],
        cwd=build_dir,
        check=False,
    )
    if result.returncode != 0:
        print("\nError: push to gh-pages failed", file=sys.stderr)
        sys.exit(1)

    # Clean up the temp .git directory
    shutil.rmtree(git_dir, ignore_errors=True)

    # Detect GitHub user/org for the URL
    user_match = re.search(r"[:/]([^/:]+)/[^/:]+?(?:\.git)?$", remote_url)
    user = user_match.group(1) if user_match else "<user>"

    print()
    print("Deployed successfully.")
    print(f"Site: https://{user}.github.io{base}/")
    print()
    print("If this is your first deploy, enable GitHub Pages:")
    print("  Settings -> Pages -> Source -> Deploy from branch -> gh-pages / root")


if __name__ == "__main__":
    main()
