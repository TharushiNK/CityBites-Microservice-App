DROP TABLE Supplier CASCADE CONSTRAINTS;
---------------------------------------

-------------------------------
SET SERVEROUTPUT ON;
DECLARE
    supplier_table VARCHAR2(2000);
BEGIN
    supplier_table := 'CREATE TABLE Supplier
                      (sup_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                       sup_name VARCHAR2(50),
                       sup_email VARCHAR2(50),
                       sup_password VARCHAR2(50))';
                       
    EXECUTE IMMEDIATE supplier_table;
END;

select * from supplier;
--------------------------------------------------------------------------------
---Add supplier ----
DROP PROCEDURE add_supplier;
CREATE PROCEDURE add_supplier(
    p_name IN VARCHAR2,             
    p_email IN VARCHAR2,            
    p_password IN VARCHAR2,        
    sup_id OUT NUMBER               
) AS
BEGIN 
    INSERT INTO Supplier (sup_name, sup_email, sup_password)
    VALUES (p_name, p_email, p_password)
    RETURNING sup_id INTO sup_id;
END;

--------------------------------------------------------------------------------
----Update Procedure----
DROP PROCEDURE update_supplier;
CREATE PROCEDURE update_supplier(p_id IN NUMBER, p_name IN VARCHAR2, p_email IN VARCHAR2,p_password IN VARCHAR2) AS
BEGIN
    UPDATE Supplier 
    SET sup_name = p_name,
        sup_email = p_email,
        sup_password =p_password
       
    WHERE sup_id = p_id;
END;
--------------------------------------------------------------------------------
------Delete Supplier-----
 
CREATE PROCEDURE  delete_supplier(p_id IN NUMBER  ) AS
BEGIN
    DELETE FROM Supplier 
    WHERE sup_id = p_id;
END;

--------------------------------------------------------------------------------
----To Get all the user----
DROP PROCEDURE get_all_suppliers;
CREATE PROCEDURE get_all_suppliers(p_results OUT SYS_REFCURSOR ) AS
BEGIN
   
    OPEN p_results FOR 
    SELECT sup_id, sup_name, sup_email,sup_password FROM Supplier;
END;
--------------------------------------------------------------------------------
---Create product for get supplier details----
DROP PROCEDURE get_supplier_by_id;
CREATE PROCEDURE get_supplier_by_id(p_id IN NUMBER,p_name OUT VARCHAR2,p_email OUT VARCHAR2,p_password OUT VARCHAR2) AS
BEGIN
  
    SELECT sup_name, sup_email,sup_password
    INTO p_name, p_email,p_password
    FROM Supplier
    WHERE sup_id = p_id;
END;
--------------------------------------------------------------------------------
DROP TABLE supplier_audit_log;
CREATE TABLE supplier_audit_log (
    log_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY, 
    sup_id NUMBER,      
    sup_name VARCHAR2(50),
    sup_email VARCHAR2(50),
    sup_password VARCHAR(50)
);

-------------------------------------------------------------------------------

CREATE OR REPLACE TRIGGER supplier_audit_trg
BEFORE DELETE ON Supplier  
FOR EACH ROW
BEGIN
    
    INSERT INTO supplier_audit_log (sup_id, sup_name, sup_email,sup_password)
    VALUES (:OLD.sup_id, :OLD.sup_name, :OLD.sup_email, :OLD.sup_password);
END;

----function to check supplier login details----
CREATE OR REPLACE FUNCTION check_supplier_credentials (
    p_sup_email IN VARCHAR2,
    p_sup_password IN VARCHAR2
) RETURN BOOLEAN IS
    v_count INTEGER;
BEGIN
    -- Check if the supplier email and password match in the Supplier table
    SELECT COUNT(*)
    INTO v_count
    FROM Supplier
    WHERE sup_email = p_sup_email
    AND sup_password = p_sup_password;

    -- If count is greater than 0, credentials are correct, return TRUE
    IF v_count > 0 THEN
        RETURN TRUE;
    ELSE
        -- If no match, return FALSE
        RETURN FALSE;
    END IF;
END check_supplier_credentials;


--------------------------------
SELECT check_supplier_credentials('cargills@gmail.com', '1234') FROM dual;
SELECT column_name, data_type, data_length, data_precision, data_scale
FROM all_tab_columns
WHERE table_name = 'SUPPLIER';

select * FROM Supplier;
