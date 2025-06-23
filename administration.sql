
----Taking permission to run this file----
ALTER SESSION SET "_ORACLE_SCRIPT" = true;


CREATE USER admin IDENTIFIED BY cityBites123
  QUOTA 20M ON USERS;

GRANT ALL PRIVILEGES TO admin;


CREATE USER customer_role IDENTIFIED BY customer123;


GRANT CONNECT, RESOURCE TO customer_role WITH ADMIN OPTION;


CREATE USER supplier_role IDENTIFIED BY supplier123;

GRANT CONNECT, RESOURCE TO supplier_role WITH ADMIN OPTION;


GRANT SELECT, INSERT, UPDATE, DELETE ON users TO customer_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON supplier TO supplier_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON product TO supplier_role;


