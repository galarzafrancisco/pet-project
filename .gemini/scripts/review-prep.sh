#!/bin/bash

# Identify current branch
current_branch=$(git branch --show-current)

# Make scratchpad directory
scratchpad_dir=".ai/scratchpad/$current_branch"
mkdir -p "$scratchpad_dir"

# Initialize plan file
plan_file="$scratchpad_dir/review.plan"
touch "$plan_file"

# Identify uncommitted changes
uncommitted_changes=$(git status --porcelain)

# Identify files changed with respect to main branch
changed_files=$(git diff --name-only main...HEAD)

# List available review guides
review_guides_dir="docs/review-guides"
available_guides=$(ls "$review_guides_dir")

# Write review plan
{
  echo "Current Branch: $current_branch"
  echo ""
  if [ -z "$uncommitted_changes" ]; then
    echo "No uncommitted changes."
  else
    echo "# Uncommitted Changes:"
    echo "$uncommitted_changes"
  fi
  echo ""
  if [ -z "$changed_files" ]; then
    echo "No committed changes with respect to main branch."
  else
    echo "# Committed changes with respect to main branch:"
    echo "$changed_files"
  fi
  echo ""
  if [ -z "$available_guides" ]; then
    echo "No review guides available."
  else
    echo "# Available Review Guides:"
    echo "$available_guides"
  fi
  echo ""
} > "$plan_file"

echo "File $plan_file ready for you to draft the review plan."