#!/bin/sh

# Ensure the script exits if a command fails or if an unset variable is used
set -e
set -u

# --- Functions ---

# POSIX functions do not use the 'function' keyword.
# They use 'name()' and cannot use the 'local' keyword.
greet_user() {
  # Positional parameters work normally ($1, $2, etc.)
  username="$1"

  if [ -z "$username" ]; then
    echo "Error: No name provided." >&2
    return 1
  fi

  echo "Hello, ${username}!"
}

# --- Main Logic ---

# 1. Standard Output and Variables
echo "Starting POSIX-compliant script..."
current_dir=$(pwd)
echo "Current directory: ${current_dir}"

echo "-----------------------------------------------"

# 2. Basic Arithmetic and Loops
# POSIX uses $(( ... )) for arithmetic. 'let' or 'expr' are not required.
count=1
while [ "$count" -le 3 ]; do
  echo "Loop iteration: ${count}"
  count=$((count + 1))
done

echo "-----------------------------------------------"

# 3. Conditional Testing and Function Call
# POSIX uses standard [ ] (test), not the Bash-specific [[ ]]
test_name="Alice"

if [ "$test_name" = "Alice" ]; then
  greet_user "$test_name"
else
  echo "User is not Alice."
fi

echo "-----------------------------------------------"

# 4. Reading User Input
# Note: 'read -p' is a bashism. POSIX requires a separate echo.
echo "Enter your favorite color: "
read -r color
echo "You chose: ${color}"

echo "Script completed successfully."
