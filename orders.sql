DROP TABLE Orders CASCADE CONSTRAINTS;
-------------------------------------
SET SERVEROUTPUT ON;
DECLARE
    order_table VARCHAR2(2000);
BEGIN
    order_table := 'CREATE TABLE ORDERS
                    (order_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                     product_id NUMBER,
                     total NUMBER,
                     discounted_amount NUMBER,
                     final_amount NUMBER,
                     order_amount NUMBER,
                     user_id NUMBER
                     )';
                     
    EXECUTE IMMEDIATE order_table;
END;

select * FROM orders;



-----------------------------------------------------------------------------
---Add Order Procedure----
DROP procedure add_order;
CREATE PROCEDURE add_order(
    p_product_id IN NUMBER,           
    p_total IN NUMBER,                
    p_discounted_amount IN NUMBER,    
    p_final_amount IN NUMBER,
    p_order_amount IN NUMBER,
    p_user_id IN NUMBER,
    order_id OUT NUMBER
) AS
BEGIN 
    INSERT INTO ORDERS (product_id, total, discounted_amount, final_amount, order_amount, user_id)
    VALUES (p_product_id, p_total, p_discounted_amount, p_final_amount, p_order_amount, p_user_id)
      RETURNING order_id INTO order_id;
    

END;

--------------------------------------------------------------------------------
----Update Order Procedure----
DROP procedure update_order;
CREATE PROCEDURE update_order(
    p_order_id IN NUMBER,            
    p_product_id IN NUMBER,           
    p_total IN NUMBER,                
    p_discounted_amount IN NUMBER,    
    p_final_amount IN NUMBER,
    p_order_amount IN NUMBER,
    p_user_id IN NUMBER
) AS
BEGIN
    -- Update the order record with the given ID
    UPDATE ORDERS
    SET product_id = p_product_id,
        total = p_total,
        discounted_amount = p_discounted_amount,
        final_amount = p_final_amount,
        order_amount = p_order_amount,
        user_id = p_user_id
    WHERE order_id = p_order_id;
END;

--------------------------------------------------------------------------------
------Delete Order Procedure-----
CREATE PROCEDURE delete_order(
    p_order_id IN NUMBER  -- Order ID to delete
) AS
BEGIN
    -- Delete the order record with the given ID
    DELETE FROM ORDERS
    WHERE order_id = p_order_id;
END;


--------------------------------------------------------------------------------
----Get All Orders Procedure----
DROP procedure get_all_orders;
CREATE PROCEDURE get_all_orders(
    p_results OUT SYS_REFCURSOR  
) AS
BEGIN
   
    OPEN p_results FOR 
    SELECT order_id, product_id, total, discounted_amount, final_amount,order_amount,user_id FROM ORDERS;
END;
SELECT order_id, product_id, total, discounted_amount, final_amount, order_amount, user_id
FROM ORDERS;

-------------------------------------------
---Create a procedure to get order details by ID--
CREATE OR REPLACE PROCEDURE get_order_by_id(
    p_order_id IN NUMBER,
    p_product_id OUT NUMBER,
    p_total OUT NUMBER,
    p_discounted_amount OUT NUMBER,
    p_final_amount OUT NUMBER,
    p_order_amount OUT NUMBER,
    p_user_id OUT NUMBER
) AS
BEGIN
    SELECT product_id, total, discounted_amount, final_amount, order_amount, user_id
    INTO p_product_id, p_total, p_discounted_amount, p_final_amount, p_order_amount, p_user_id
    FROM ORDERS
    WHERE order_id = p_order_id;
END;


-------------------------------------------
---Create an audit table to save the order history before deletion---
DROP TABLE order_audit_log;
CREATE TABLE order_audit_log (
    log_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,  
    order_id NUMBER,          
    product_id NUMBER,        
    total NUMBER,             
    discounted_amount NUMBER, 
    final_amount NUMBER ,
    order_amount NUMBER,
    user_id NUMBER
);




CREATE OR REPLACE TRIGGER order_audit_trg
BEFORE DELETE ON ORDERS 
FOR EACH ROW
BEGIN

    INSERT INTO order_audit_log (order_id, product_id, total, discounted_amount, final_amount,order_amount,user_id)
    VALUES (:OLD.order_id, :OLD.product_id, :OLD.total, :OLD.discounted_amount, :OLD.final_amount, :OLD.order_amount, :OLD.user_id);
END;


----create a procedure to return 3 values---
CREATE OR REPLACE PROCEDURE calculate_order_values(
    p_order_amount       IN  NUMBER,  ----Number of items ordered
    p_per_price          IN  NUMBER,  ----Price per item
    p_total              OUT NUMBER,  -- Total cost = order_amount * per_price
    p_discounted_amount  OUT NUMBER,  -- Discount amount = total * discount_rate
    p_final_amount       OUT NUMBER   -- Final cost after discount = total - discounted_amount
) AS
    v_discount NUMBER;
BEGIN
    -- Calculate the total cost
    p_total := p_order_amount * p_per_price;
    
    -- Determine the discount rate based on the total
    IF p_total > 5000 THEN
         v_discount := 0.5;  -- 50% discount
    ELSIF p_total > 1000 THEN
         v_discount := 0.2;  -- 20% discount
    ELSE
         v_discount := 0;
    END IF;
    
    -- Calculate the discounted amount and the final amount
    p_discounted_amount := p_total * v_discount;
    p_final_amount := p_total - p_discounted_amount;
END;





--------procedure to get all orders by id----
CREATE OR REPLACE PROCEDURE get_orders_by_user_id(
    p_user_id IN NUMBER,
    p_result OUT SYS_REFCURSOR
) AS
BEGIN
    OPEN p_result FOR 
        SELECT order_id, product_id, total, discounted_amount, final_amount, order_amount, user_id
        FROM ORDERS
        WHERE user_id = p_user_id;
END;



-----procedure to Get Products Ordered by Total Sales (Order Amount)
CREATE OR REPLACE PROCEDURE get_products_ordered_by_sales(
    p_results OUT SYS_REFCURSOR
) AS
BEGIN
    -- Open a cursor to fetch the products and their total order amount, ordered by the total order amount
    OPEN p_results FOR 
        SELECT p.product_id,
               p.description,
               p.per_price,
               p.quantity,
               p.sup_id,
               p.remaining,
               SUM(o.order_amount) AS total_order_amount
        FROM product p
        JOIN orders o ON p.product_id = o.product_id
        GROUP BY p.product_id, p.description, p.per_price, p.quantity, p.sup_id, p.remaining
        ORDER BY total_order_amount DESC;
END;
