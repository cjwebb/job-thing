# job-thing

Node.js app. User auth, and basic website with signup, and making friends.

Users and normal stuff are stored in MySQL. `db.js` contains reference to Neo4J, which is intended to model the social graph between users. Whilst users could also take place in Neo4J, I trust what I'm doing with MySQL a lot more. Plus, we'll be doing stuff with money... and I've done invoicing and reconciliation in SQL before.

Anyway, check out `setupdb.sql` and make sure that you have a MySQL Server running with those databases/tables.

