package com.example.freshmart_user.service;


import com.example.freshmart_user.entity.Product;
import com.example.freshmart_user.entity.Supplier;
import com.example.freshmart_user.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Types;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class SupplierService {

    @Autowired
    public SupplierRepository supplierRepository;

    @Autowired
    public JdbcTemplate jdbcTemplate;

    //create supplier
    public Supplier createSupplier(Supplier supplier) {
        return jdbcTemplate.execute((Connection conn) -> {
            // 1. Prepare the call to the stored procedure
            CallableStatement cs = conn.prepareCall("{CALL add_supplier(?, ?, ?, ?)}");

            // 2. Set input parameters
            cs.setString(1, supplier.getSup_name());
            cs.setString(2, supplier.getSup_email());
            cs.setString(3, supplier.getSup_password());

            // 3. Register output parameter for sup_id
            cs.registerOutParameter(4, Types.INTEGER);

            // 4. Execute the procedure
            cs.execute();

            // 5. Get the generated sup_id
            int generatedSupId = cs.getInt(4);
            supplier.setSup_id(generatedSupId);

            return supplier;
        });
    }

    //update supplier
    public Supplier updateSupplier(int sup_id, Supplier supplier) {
        jdbcTemplate.update("CALL update_supplier(?,?,?,?)",
                sup_id,
                supplier.getSup_name(),
                supplier.getSup_email(),
                supplier.getSup_password());
        return supplier;
    }

    //delete supplier
    public String deleteSupplier(int sup_id) {
        jdbcTemplate.update("CALL delete_supplier(?)",
                sup_id);
        return "supplier deletion successful";
    }

    //get all the suppliers

    public List<Supplier> getAllSuppliers() {
        // Simple call to PL/SQL procedure
        return jdbcTemplate.execute(
                (Connection conn) -> {
                    CallableStatement cs = conn.prepareCall("{CALL get_all_suppliers(?)}");
                    cs.registerOutParameter(1, Types.REF_CURSOR);
                    cs.execute();

                    // Auto-map results to Product objects
                    try (ResultSet rs = (ResultSet) cs.getObject(1)) {
                        List<Supplier> suppliers = new ArrayList<>();
                        while (rs.next()) {
                            Supplier supplier = new Supplier();
                            supplier.setSup_id(rs.getInt("sup_id"));
                            supplier.setSup_name(rs.getString("sup_name"));
                            supplier.setSup_email(rs.getString("sup_email"));
                            supplier.setSup_password(rs.getString("sup_password"));

                            suppliers.add(supplier);
                        }
                        return suppliers;
                    }
                }
        );
    }

    //get suppliers by id
    public Supplier getSupplierById(int sup_id) {
        return jdbcTemplate.execute(
                (Connection conn) -> {
                    // Prepare the call with OUT parameters
                    CallableStatement cs = conn.prepareCall(
                            "{CALL get_supplier_by_id(?, ?, ?, ? )}"
                    );

                    // Set IN parameter
                    cs.setInt(1, sup_id);

                    // Register OUT parameters
                    cs.registerOutParameter(2, Types.VARCHAR);  // p_name
                    cs.registerOutParameter(3, Types.VARCHAR);  // p_email
                    cs.registerOutParameter(4, Types.VARCHAR);  // p_password


                    cs.execute();

                    // Create and populate supplier object
                    Supplier supplier = new Supplier();
                    supplier.setSup_id(sup_id);  // Set the ID we searched for
                    supplier.setSup_name(cs.getString(2));
                    supplier.setSup_email(cs.getString(3));
                    supplier.setSup_password(cs.getString(4));


                    return supplier;
                }
        );
    }

    //supplier login
    // Method to check if supplier credentials are correct
    public Map<String, Object> checkSupplierCredentials(String sup_email, String sup_password) {
        // SQL to call the check_supplier_credentials function in PL/SQL
        String sql = "BEGIN ? := check_supplier_credentials(?, ?); END;";

        return jdbcTemplate.execute((Connection connection) -> {
            CallableStatement cs = connection.prepareCall(sql);

            // Set input parameters
            cs.setString(2, sup_email);
            cs.setString(3, sup_password);

            // Register the output parameter (boolean)
            cs.registerOutParameter(1, Types.BOOLEAN);

            // Execute the callable statement
            cs.execute();

            // Get the boolean result (valid or invalid credentials)
            boolean isValid = cs.getBoolean(1);

            if (isValid) {
                // If credentials are valid, return the supplier details (id and name, for example)
                String query = "SELECT sup_id, sup_name, sup_email FROM Supplier WHERE sup_email = ?";
                List<Map<String, Object>> results = jdbcTemplate.queryForList(query, sup_email);

                if (results.size() == 1) {
                    return results.get(0); // Return the first and only result
                } else {
                    return null; // Or handle the case when there are multiple or no results
                }
            } else {
                return null; // If invalid credentials
            }
        });
    }
}
