# PriCloud

### comments
there are types of comments in the code that needs attention.

- `TODO:` = standard todo to remember to redo (mostly when working with new structure)
- `TODO(1):` = high priority to fix for better performance, structure or duplication
- `TODO(2):` = second priority to consider to fix
- `RISK:` = places where there is a security risk

### setup

- clone the repo
- create a file in `./app/` called `app.settings.js`:
```
var SITE=test/
var SITENAME="Test";
var DBSERVER="https://www.priocloud.com/testrest";
var USERSERVER="https://www.priocloud.com/testuser";
```
- run `npm install`

### development

- run `npm start`

### production 

- run `npm run build:production`
