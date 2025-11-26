#!/bin/bash
cd /home/kavia/workspace/code-generation/simple-notes-application-46986-46995/frontend_nuxt
npx eslint 
$ESLINT_EXIT_CODE
npm run build
BUILD_EXIT_CODE=$?
if [ $ESLINT_EXIT_CODE -ne 0 ] || [ $BUILD_EXIT_CODE -ne 0 ]; then
   exit 1
fi

