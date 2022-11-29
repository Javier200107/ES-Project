**How to execute MegaLinter locally?**

# Installation

## Pre-requisites
You need to have NodeJS and Docker installed on your computer to run MegaLinter locally with MegaLinter Runner.

<https://nodejs.org/en/>  
<https://www.docker.com/>

## Global installation

npm install mega-linter-runner -g

## Local installation

npm install mega-linter-runner --save-dev

## No installation
You can run mega-linter-runner without installation by using npx

## Usage

mega-linter-runner [OPTIONS] [FILES]

### Example

mega-linter-runner  
mega-linter-runner --fix # To apply auto-fix