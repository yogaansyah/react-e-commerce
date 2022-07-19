import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import NumberFormat from "react-number-format";
import { useHistory } from "react-router-dom";
import swal from "sweetalert";

function Checkout() {
    const history = useHistory();

    if (!localStorage.getItem("auth_token")) {
        history.push("/");
        swal("Warning", "Login to goto your Cart", "error");
    }

    const [loading, setLoading] = useState(true);
    const [cart, setCart] = useState([]);
    var totalCartPrice = 0;

    const [checkoutInput, setCheckoutInput] = useState({
        firstname: "",
        lastname: "",
        phone: "",
        email: "",
        address: "",
        city: "",
        state: "",
        zipcode: "",
    });

    const [error, setError] = useState([]);

    useEffect(() => {
        let isMounted = true;

        axios.get(`/api/cart`).then((res) => {
            if (isMounted) {
                if (res.data.status === 200) {
                    setCart(res.data.cart);

                    setLoading(false);
                } else if (res.data.status === 401) {
                    history.push("/");
                    swal("Warning", res.data.message, "error");
                }
            }
        });

        return () => {
            isMounted = false;
        };
    }, [history]);

    const handleInput = (e) => {
        e.persist();
        setCheckoutInput({ ...checkoutInput, [e.target.name]: e.target.value });
    };

    var orderinfo_data = {
        firstname: checkoutInput.firstname,
        lastname: checkoutInput.lastname,
        phone: checkoutInput.phone,
        email: checkoutInput.email,
        address: checkoutInput.address,
        city: checkoutInput.city,
        state: checkoutInput.state,
        zipcode: checkoutInput.zipcode,
        payment_mode: "Paid by PayPal",
        payment_id: "",
    };


    //PAYPAL CODE
    const PayPalButton = window.paypal.Buttons.driver("react", { React, ReactDOM });
    const createOrder = (data, actions) => {
        return actions.order.create({
            purchase_units: [
                {
                    amount: {
                        value: totalCartPrice,
                    },
                },
            ],
        });
    };
    const onApprove = (data, actions) => {
        // return actions.order.capture();
        return actions.order.capture().then(function (details) {
            console.log(details);
            orderinfo_data.payment_id = details.id;

            axios.post(`/api/place-order`, orderinfo_data).then((res) => {
                if (res.data.status === 200) {
                    swal("Order Placed Successfully", res.data.message, "success");
                    setError([]);
                    history.push("/thank-you");
                } else if (res.data.status === 422) {
                    swal("All Field are Mandetory", "", "error");
                    setError(res.data.errors);
                }
            });
        });
    };
    //END-PAYPAL CODE

    const submitOrder = (e, payment_mode) => {
        e.preventDefault();

        var data = {
            firstname: checkoutInput.firstname,
            lastname: checkoutInput.lastname,
            phone: checkoutInput.phone,
            email: checkoutInput.email,
            address: checkoutInput.address,
            city: checkoutInput.city,
            state: checkoutInput.state,
            zipcode: checkoutInput.zipcode,
            payment_mode: payment_mode,
            payment_id: "",
        };

        switch (payment_mode) {
            case "cod":
                axios.post(`/api/place-order`, data).then((res) => {
                    if (res.data.status === 200) {
                        swal("Order Placed Successfully", res.data.message, "success");
                        setError([]);
                        history.push("/thank-you");
                    } else if (res.data.status === 422) {
                        swal("All Field are Mandetory", "", "error");
                        setError(res.data.errors);
                    }
                });
                break;

            case "razorpay":
                axios.post(`/api/validate-order`, data).then((res) => {
                    if (res.data.status === 200) {
                        setError([]);
                    } else if (res.data.status === 422) {
                        swal("All fields are mandetory", "", "error");
                        setError(res.data.errors);
                    }
                });
                break;

            case "payonline":
                axios.post(`/api/validate-order`, data).then((res) => {
                    if (res.data.status === 200) {
                        setError([]);
                        var myModal = new window.bootstrap.Modal(
                            document.getElementById("payOnlineModal")
                        );
                        myModal.show();
                    } else if (res.data.status === 422) {
                        swal("All fields are mandetory", "", "error");
                        setError(res.data.errors);
                    }
                });
                break;

            default:
                break;
        }

        // axios.post(`/api/place-order`, data).then((res) => {
        //     if (res.data.status === 200) {
        //         swal("Order Placed Successfully", res.data.message, "success");
        //         setError([]);
        //         history.push("/thank-you");
        //     } else if (res.data.status === 422) {
        //         swal("All Field are Mandetory", "", "error");
        //         setError(res.data.errors);
        //     }
        // });
    };

    if (loading) {
        return <h4>Loading Checkout...</h4>;
    }

    var checkout_HTML = "";
    if (cart.length > 0) {
        checkout_HTML = (
            <div>
                <div className="row">
                    <div className="col-md-7">
                        <div className="card">
                            <div className="card-header">
                                <h4>Basic Information</h4>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label> First Name</label>
                                            <input
                                                type="text"
                                                name="firstname"
                                                className="form-control"
                                                onChange={handleInput}
                                                value={checkoutInput.firstname}
                                            />
                                            <small className="text-danger">{error.firstname}</small>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label> Last Name</label>
                                            <input
                                                type="text"
                                                name="lastname"
                                                className="form-control"
                                                onChange={handleInput}
                                                value={checkoutInput.lastname}
                                            />
                                            <small className="text-danger">{error.lastname}</small>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label> Phone Number</label>
                                            <input
                                                type="text"
                                                name="phone"
                                                className="form-control"
                                                onChange={handleInput}
                                                value={checkoutInput.phone}
                                            />
                                            <small className="text-danger">{error.phone}</small>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label> Email Address</label>
                                            <input
                                                type="text"
                                                name="email"
                                                className="form-control"
                                                onChange={handleInput}
                                                value={checkoutInput.email}
                                            />
                                            <small className="text-danger">{error.email}</small>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="form-group mb-3">
                                            <label> Full Address</label>
                                            <textarea
                                                rows="3"
                                                className="form-control"
                                                onChange={handleInput}
                                                value={checkoutInput.address}
                                                name="address"
                                            ></textarea>
                                            <small className="text-danger">{error.address}</small>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label> City</label>
                                            <input
                                                type="text"
                                                name="city"
                                                className="form-control"
                                                onChange={handleInput}
                                                value={checkoutInput.city}
                                            />
                                            <small className="text-danger">{error.city}</small>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label> State</label>
                                            <input
                                                type="text"
                                                name="state"
                                                className="form-control"
                                                onChange={handleInput}
                                                value={checkoutInput.state}
                                            />
                                            <small className="text-danger">{error.state}</small>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label> Zip Code</label>
                                            <input
                                                type="text"
                                                name="zipcode"
                                                className="form-control"
                                                onChange={handleInput}
                                                value={checkoutInput.zipcode}
                                            />
                                            <small className="text-danger">{error.zipcode}</small>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="form-group text-end">
                                            <button
                                                type="button"
                                                className="btn btn-primary mx-1"
                                                onClick={(e) => submitOrder(e, "cod")}
                                            >
                                                COD
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-primary mx-1"
                                                onClick={(e) => submitOrder(e, "razorpay")}
                                            >
                                                Razor Pay
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-warning mx-1"
                                                onClick={(e) => submitOrder(e, "payonline")}
                                            >
                                                Pay Online
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-5">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th width="50%">Product</th>
                                    <th>Price</th>
                                    <th>Qty</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cart.map((item, index) => {
                                    totalCartPrice += item.product.selling_price * item.product_qty;
                                    return (
                                        <tr key={index}>
                                            <td>{item.product.name}</td>
                                            <td>
                                                <NumberFormat
                                                    thousandsGroupStyle="thousand"
                                                    value={item.product.selling_price}
                                                    prefix="Rp "
                                                    displayType="text"
                                                    thousandSeparator={true}
                                                />
                                            </td>
                                            <td>{item.product_qty}</td>
                                            <td>
                                                <NumberFormat
                                                    thousandsGroupStyle="thousand"
                                                    value={item.product.selling_price * item.product_qty}
                                                    prefix="Rp "
                                                    displayType="text"
                                                    thousandSeparator={true}
                                                />
                                            </td>
                                        </tr>
                                    );
                                })}
                                <tr>
                                    <td colSpan="2" className="text-end fw-bold">
                                        Grand Total
                                    </td>
                                    <td colSpan="2" className="text-end fw-bold">
                                        <NumberFormat
                                            thousandsGroupStyle="thousand"
                                            value={totalCartPrice}
                                            prefix="Rp "
                                            displayType="text"
                                            thousandSeparator={true}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    } else {
        checkout_HTML = (
            <div>
                <div className="card card-body py-5 text-center shadow-sm">
                    <h4>Your Shopping Cart is Empty - You are in Checkout Page</h4>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Modal */}
            <div
                className="modal fade"
                id="payOnlineModal"
                tabIndex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">
                                Online Payment Mode
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            />
                        </div>
                        <div className="modal-body">
                            <hr />
                            <PayPalButton
                                createOrder={(data, actions) => createOrder(data, actions)}
                                onApprove={(data, actions) => onApprove(data, actions)}
                            />
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                            >
                                Close
                            </button>
                            <button type="button" className="btn btn-primary">
                                Save changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="py-3 bg-warning">
                <div className="container">
                    <h6>Home / Checkout</h6>
                </div>
            </div>

            <div className="py-4">
                <div className="container">{checkout_HTML}</div>
            </div>
        </div>
    );
}

export default Checkout;
