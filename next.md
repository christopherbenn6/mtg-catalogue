# Things to Work On
* Transform Cards
* Entire Deckbuilder

## Deckbuilder Login Notes:
When click deckbuilder or log in (header), go to deckbuilder page. 

Check if user is set with state change. If user exists, then user is logged in, do the following: 
1. Set display none to forms and display block to actual page.
2. Change header value from log in to log out
3. Get all deck data where the User Id is in the decks table

If user is not logged in by default, then do the following: 
1. Show forms

Forms should contain an option to reset password, log in with email/password, Google OAuth.

## Deckbuilder Logic:
When a user is logged in they should see each deck they have made with options to view, playtest and edit them.