# This is a justfile (https://github.com/casey/just)
# Good cheatsheet (https://cheatography.com/linux-china/cheat-sheets/justfile/)


# base production deployment path
# No `/` at the end!
# MAKE SURE TO CHANGE `base: '/',` in vite.config.js to match final deployment
base_prod_path := ""
	
# default recipe to display help information
default:
  @just --list

# compile the app
build:
  npm run build -- --base {{base_prod_path}}/

wat:
  echo {{base_prod_path}}