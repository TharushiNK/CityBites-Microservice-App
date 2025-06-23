DROP TABLE Delivery CASCADE CONSTRAINTS;
----------------------------------------

---create a table for delivery details---

DROP TABLE DELIVERY;

SET SERVEROUTPUT ON;
DECLARE
    delivery_table VARCHAR2(2000);
BEGIN
    delivery_table := 'CREATE TABLE DELIVERY
                       (delivery_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                        order_id NUMBER,
                        user_id NUMBER,
                        delivery_date DATE,
                        delivery_status VARCHAR2(50),
                        delivery_address VARCHAR2(255),
                        pay_id NUMBER)';
                
    EXECUTE IMMEDIATE delivery_table;
END;



-----create a procedure for add delivery----
DROP PROCEDURE add_delivery;
CREATE PROCEDURE add_delivery(
    p_order_id IN NUMBER,
    p_user_id IN NUMBER,
    p_delivery_date IN DATE,
    p_delivery_status IN VARCHAR2,
    p_delivery_address IN VARCHAR2,
    p_pay_id IN NUMBER,
     p_delivery_id OUT NUMBER  
) AS
BEGIN 
    INSERT INTO DELIVERY (order_id, user_id, delivery_date, delivery_status, delivery_address,pay_id)
    VALUES (p_order_id, p_user_id, p_delivery_date, p_delivery_status, p_delivery_address,p_pay_id)
    RETURNING delivery_id INTO p_delivery_id;
    
END;

----create a procedure for update delivery---

CREATE PROCEDURE update_delivery(
    p_delivery_id IN NUMBER,
    p_order_id IN NUMBER,
    p_user_id IN NUMBER,
    p_delivery_date IN DATE,
    p_delivery_status IN VARCHAR2,
    p_delivery_address IN VARCHAR2
) AS
BEGIN
    UPDATE DELIVERY 
    SET order_id = p_order_id,
        user_id = p_user_id,
        delivery_date = p_delivery_date,
        delivery_status = p_delivery_status,
        delivery_address = p_delivery_address
    WHERE delivery_id = p_delivery_id;
END;

----create a procedure to delete delivery details---
DROP PROCEDURE delete_delivery;
CREATE PROCEDURE delete_delivery(
    p_delivery_id IN NUMBER
) AS
BEGIN
    DELETE FROM DELIVERY
    WHERE delivery_id = p_delivery_id;
END;

----create a procedure to get all deleivery details---
DROP PROCEDURE get_all_deliveries;
CREATE PROCEDURE get_all_deliveries(
    p_results OUT SYS_REFCURSOR
) AS
BEGIN
    OPEN p_results FOR 
    SELECT delivery_id, order_id, user_id, delivery_date, delivery_status, delivery_address
    FROM DELIVERY;
END;

-----create a procedure to get delivery details by id-----------
DROP PROCEDURE get_delivery_by_id;
CREATE PROCEDURE get_delivery_by_id(
    p_delivery_id IN NUMBER,
    p_order_id OUT NUMBER,
    p_user_id OUT NUMBER,
    p_delivery_date OUT DATE,
    p_delivery_status OUT VARCHAR2,
    p_delivery_address OUT VARCHAR2
) AS
BEGIN
    SELECT order_id, user_id, delivery_date, delivery_status, delivery_address
    INTO p_order_id, p_user_id, p_delivery_date, p_delivery_status, p_delivery_address
    FROM DELIVERY
    WHERE delivery_id = p_delivery_id;
END;

----create a delivery audit table before deletion

DROP TABLE delivery_audit_log;
CREATE TABLE delivery_audit_log (
    log_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    delivery_id NUMBER,
    order_id NUMBER,
    user_id NUMBER,
    delivery_date DATE,
    delivery_status VARCHAR2(50),
    delivery_address VARCHAR2(255)
);

----create a trigger for delivery audit log---

CREATE OR REPLACE TRIGGER delivery_auditing_trg
BEFORE DELETE ON DELIVERY
FOR EACH ROW
BEGIN
    INSERT INTO delivery_audit_log (delivery_id, order_id, user_id, delivery_date, delivery_status, delivery_address)
    VALUES (:OLD.delivery_id, :OLD.order_id, :OLD.user_id, :OLD.delivery_date, :OLD.delivery_status, :OLD.delivery_address);
END;

----create a procedure to get all deliveries by user_id ----
DROP PROCEDURE get_deliveries_by_user_id;
CREATE OR REPLACE PROCEDURE get_deliveries_by_user_id(
    p_user_id IN NUMBER,
    p_result OUT SYS_REFCURSOR
) AS
BEGIN
    OPEN p_result FOR 
        SELECT delivery_id, order_id, user_id, delivery_date, delivery_status, delivery_address, pay_id
        FROM DELIVERY
        WHERE user_id = p_user_id;
END;