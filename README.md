# node-red-contrib-postgrestor

## Disclaimer
THIS IS A FORK. 

The current upstream repo seems to be abandoned, and I am using this for my own setup. I will be making chagnes and updates and documenting them here. I will also be 
publishing this as a npm package if others would like to use it. Feel free to submit pull request. 

~Jess Patton

## Issues I ran into, and ways to fix them. 
These are issues I ran into and could not find easy documentation about. I will also be trying to update to code to handle some of these situations better in the future,
but for now, here are some work arounds.
**INSERTS**:
  Take this insert for example. 
  
  ```sql 
  INSERT INTO public.baby_events ("createdAt", event_id, description) VALUES (now() at time zone 'utc', {{msg.payload.event_id}}, '{{msg.payload.description}}')
  ```
  
  When doing an insert, or even a select using postgrestor, there are some columns and values that need massaging to get to work as expected. 
  1) When a value being inserted is a string, or type text, you have to surround it with ```'```, otherwise it will be passed in with ```"``` and be treated as a 
      column name, rather than a value. You can see i do this here with ```'{{{msg.payload.description}}'```
  2) If you get an error that a column name does not exist, try surrounding it with ```"```. You can see I had to do that with ```"createdAt"```. Without those I 
      recieced an error that ```createdat column did not exist```

## Description
Postgrestor :space_invader: is a [**Node-RED**](http://nodered.org/) node allowing basic access to [**Postgres**](https://www.postgresql.org/) :elephant: database.

Postgrestor sets up a console to execute queries against the configured database.

```msg.payload``` will contain the result object of the query. It has the following properties:
* ```command```: The sql command that was executed (e.g. "SELECT", "UPDATE", etc.)
* ```rowCount```: The number of rows affected by the SQL statement
* ```oid```: The oid returned
* ```rows```: An array of rows

Postgres implements a template engine allowing parameterized queries:
```sql
/* INTEGER id COLUMN */
SELECT * FROM table WHERE id = {{ msg.id }}

/* VARCHAR id COLUMN */
SELECT * FROM table WHERE id = '{{ msg.id }}'

```
## Installation

#### Using the Node-RED Editor
From version 0.15 of [**Node-RED**](http://nodered.org/) you can install [**Postgrestor**](https://github.com/HySoaKa/node-red-contrib-postgrestor) directly using the editor. To do this select ```Manage Palette``` from the menu (top right), and then select the ```install``` tab in the palette.

You can now search for [**Postgrestor**](https://github.com/HySoaKa/node-red-contrib-postgrestor) to install.


#### Installing npm packaged nodes
To install [**Postgrestor**](https://github.com/HySoaKa/node-red-contrib-postgrestor) npm-packaged node, you can also, either install it locally within your user data directory (by default, ```$HOME/.node-red```):
```bash
cd $HOME/.node-red
npm i postgrestor
```
or globally alongside Node-RED:
```bash
npm i -g posgtrestor
```
You will need to restart Node-RED for it to pick-up [**Postgrestor**](https://github.com/HySoaKa/node-red-contrib-postgrestor).


[![NPM](https://nodei.co/npm/postgrestor.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/postgrestor/)


## Screen shots
<p align="center">
<img src="http://i.imgur.com/D03T3vH.png" width="600">
<img src="http://i.imgur.com/gXPpsxz.png" width="600">
<img src="http://i.imgur.com/WTpmbT5.png" width="600">
<img src="http://i.imgur.com/jR0Z08P.png" width="600">
</p>
