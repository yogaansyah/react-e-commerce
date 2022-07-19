import axios from "axios";
import React, { useEffect, useState } from "react";
import NumberFormat from "react-number-format";
import { Link } from "react-router-dom";

function ViewProduct() {

    const [loading, setLoading] = useState(true);
    const [viewProduct, setProduct] = useState([]);

    useEffect(() => {
        let isMounted = true;
        document.title = "View Product";

        axios.get("/api/view-product").then((res) => {
            if (isMounted) {
                if (res.data.status === 200) {
                    setProduct(res.data.products);
                    setLoading(false);
                }
            }
        });
        return () => {
            isMounted = false;
        };
    }, []);

    var display_Productdata = "";

    if (loading) {
        return <h4>View Product Loading...</h4>;
    } else {
        // var ProdStatus = "";
        display_Productdata = viewProduct.map((item, i) => {
            // if (item.status == "0") {
            //     ProdStatus = "Shown";
            // } else if (item.status == "1") {
            //     ProdStatus = "Hidden";
            // }

            return (
                <tr key={i}>
                    <td>{item.id}</td>
                    <td>{item.category.name}</td>
                    <td>{item.name}</td>
                    <td>

                        <NumberFormat
                            thousandsGroupStyle="thousand"
                            value={item.selling_price}
                            prefix="Rp "
                            displayType="text"
                            thousandSeparator={true}
                        />
                    </td>
                    <td>
                        <img
                            src={`https://shielded-fjord-97601.herokuapp.com/uploads/product/${item.image}`}
                            width="125px"
                            alt={item.name}
                        />
                    </td>
                    <td>
                        <Link to={`edit-product/${item.id}`} className="btn btn-success btn-sm">
                            Edit
                        </Link>
                    </td>
                    {/* <td>{ProdStatus}</td> */}
                    <td>{item.status === 0 ? "Visible" : "Hidden"}</td>
                </tr>
            );
        });
    }

    return (
        <div className="card px-4 mt-3">
            <div className="card-header">
                <h4>
                    View Product
                    <Link to="/admin/add-product" className="btn btn-primary btn-sm float-end">
                        Add Product
                    </Link>
                </h4>
            </div>
            <div className="card-body">
                <div className="table-responsive">
                    <table className="table table-bordered table-striped">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Category Name</th>
                                <th>Product Name</th>
                                <th>Selling Price</th>
                                <th>Image</th>
                                <th>Edit</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>{display_Productdata}</tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default ViewProduct;
