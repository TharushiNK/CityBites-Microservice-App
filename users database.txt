DROP TABLE USERS CASCADE CONSTRAINTS;
-----------------------------------------

-----CREATE A USER TABLE----


SET SERVEROUTPUT ON;
DECLARE
    user_table VARCHAR2(2000);
BEGIN
    user_table := 'CREATE TABLE USERS
                (user_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                user_name VARCHAR2(50),
                user_email VARCHAR2(50),
                user_password VARCHAR2(50),
                user_role VARCHAR2(50))';
                
    EXECUTE IMMEDIATE user_table;

END;
-------------------------------------------
---create a procedure for add new user--
---pass 4 parameters to the inside----
DROP PROCEDURE add_user;
CREATE procedure add_user(p_name IN VARCHAR2, p_email IN VARCHAR2, p_password IN VARCHAR2, p_role IN VARCHAR2,   user_id OUT NUMBER) AS
BEGIN 
    INSERT INTO USERS (user_name, user_email, user_password, user_role)
    VALUES(p_name,p_email,p_password,p_role)
           RETURNING user_id INTO user_id; 
END;



DROP PROCEDURE update_user;
---Create a procedure for update user
--pass 5 parameters to the inside---
CREATE procedure update_user(p_id IN NUMBER,p_name IN VARCHAR2, p_email IN VARCHAR2, p_password IN VARCHAR2, p_role IN VARCHAR2)AS
BEGIN
    UPDATE USERS SET
    user_name = p_name,
    user_email = p_email,
    user_password =p_password,
    user_role = p_role
    WHERE
    user_id = p_id;
    
END; 

---Create procedure to delete user
---pass id as the parameter to the inside--
CREATE procedure delete_user(p_id IN NUMBER)AS
BEGIN
    DELETE FROM USERS
    WHERE user_id = p_id;
END;

---create a procedure to get all the users---
---return set of results as cursor variable
DROP PROCEDURE get_all_users;
CREATE procedure get_all_users(p_results OUT SYS_REFCURSOR)AS
BEGIN
    OPEN p_results FOR SELECT user_id, user_name, user_email,user_password,user_role FROM USERS;
END;

---Create a procedure for get user details by id--
CREATE PROCEDURE get_user_by_id(p_id IN NUMBER,p_name OUT VARCHAR2, p_email OUT VARCHAR2, p_password OUT VARCHAR2, p_role OUT VARCHAR2)AS
BEGIN
    SELECT user_name , user_email, user_password,user_role INTO p_name, p_email,p_password,p_role
    FROM USERS
    WHERE user_id = p_id;
END;

---Create a audit table for save the user history before a deletion---
DROP TABLE user_audit_log;
CREATE TABLE user_audit_log (
    log_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id NUMBER,
    username VARCHAR2(100),
    password VARCHAR2(100),
    email VARCHAR2(100),
    userrole VARCHAR2(100));
    
    
----create a trigger to save the details in audit log--
CREATE OR REPLACE TRIGGER user_auditing_tr1
BEFORE DELETE ON USERS
FOR EACH ROW
BEGIN
    INSERT INTO user_audit_log(user_id,username,email,password,userrole)
    VALUES(:OLD.user_id, 
    :OLD.user_name,
    :OLD.user_email,
    :OLD.user_password,
    :OLD.user_role);
END;


----fucntion to check username and password--
CREATE OR REPLACE FUNCTION check_user_credentials (
    p_user_email IN VARCHAR2,
    p_password IN VARCHAR2
) RETURN BOOLEAN IS
    v_count INTEGER;
BEGIN
    -- Check if the user email and password match in the users table
    SELECT COUNT(*)
    INTO v_count
    FROM users
    WHERE user_email = p_user_email
    AND user_password = p_password;

    -- If count is greater than 0, credentials are correct, return TRUE
    IF v_count > 0 THEN
        RETURN TRUE;
    ELSE
        -- If no match, return FALSE
        RETURN FALSE;
    END IF;
END check_user_credentials;

