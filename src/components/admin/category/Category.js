import axios from 'axios';
import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import swal from 'sweetalert';

function Category(props) {

    const [categoryInput, setCategory] = useState({
        slug: '',
        name: '',
        descrip: '',
        status: '',

        meta_title: '',
        meta_keyword: '',
        meta_descrip: '',
        errors_list: []
    });

    const handleInput = (e) => {
        e.persist();
        setCategory({ ...categoryInput, [e.target.name]: e.target.value })
    }

    const submitCategory = (e) => {
        e.preventDefault();

        const data = {
            slug: categoryInput.slug,
            name: categoryInput.name,
            descrip: categoryInput.descrip,
            status: categoryInput.status,

            meta_title: categoryInput.meta_title,
            meta_keyword: categoryInput.meta_keyword,
            meta_descrip: categoryInput.meta_descrip,
        }

        axios.post('/api/store-category', data).then(res => {
            if (res.data.status === 200) {
                swal("Success", res.data.message, "success");
                document.getElementById('CATEGORY_FORM').reset(); //reset document setelah submit
                setCategory({
                    slug: '',
                    name: '',
                    descrip: '',
                    status: '',

                    meta_title: '',
                    meta_keyword: '',
                    meta_descrip: '',
                });
            }
            else if (res.data.status === 400) {
                setCategory({ ...categoryInput, errors_list: res.data.errors });
            }
        });


    }

    var display_errors = [];
    if (categoryInput.errors_list) {
        display_errors = [
            categoryInput.errors_list.slug,
            categoryInput.errors_list.name,
            categoryInput.errors_list.meta_title,
        ]
    }

    return (
        <div className='container-fluid px-4'>
            <h1 className="mt-4">Add Category</h1>

            {
                display_errors.map((item, i) => {
                    return (
                        <p className='mb-1' key={i}>
                            {item}
                        </p>
                    )
                })
            }

            <div className="card mt-4">
                <div className="card-header">
                    <h4>Add Category
                        <Link to="/admin/view-category" className='btn btn-primary btn-sm float-end'>View Category</Link>
                    </h4>
                </div>
            </div>

            <form onSubmit={submitCategory} id="CATEGORY_FORM">
                <div>
                    <ul className="nav nav-tabs" id="myTab" role="tablist">
                        <li className="nav-item" role="presentation">
                            <button className="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home" type="button" role="tab" aria-controls="home" aria-selected="true">Home</button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button className="nav-link" id="seo-tags-tab" data-bs-toggle="tab" data-bs-target="#seo-tags" type="button" role="tab" aria-controls="seo-tags" aria-selected="true">SEO Tags</button>
                        </li>
                    </ul>
                    <div className="tab-content" id="myTabContent">
                        <div className="tab-pane card-body border fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                            <div className="form-group mb-3">
                                <label>Slug</label>
                                <input type="text" name="slug" onChange={handleInput} value={categoryInput.slug} className='form-control' />

                                {/* <span>{categoryInput.errors_list.slug}</span> */}
                            </div>
                            <div className="form-group mb-3">
                                <label>Name</label>
                                <input type="text" name="name" onChange={handleInput} value={categoryInput.name} className='form-control' />
                            </div>
                            <div className="form-group mb-3">
                                <label>Description</label>
                                <textarea name="descrip" onChange={handleInput} value={categoryInput.descrip} className='form-control' ></textarea>
                            </div>
                            <div className="form-group mb-3">
                                <label>Status</label>
                                <input type="checkbox" name="status" onChange={handleInput} value={categoryInput.status} /> Status 0=show/1=hidden
                            </div>
                        </div>
                        <div className="tab-pane card-body border fade" id="seo-tags" role="tabpanel" aria-labelledby="seo-tags-tab">
                            <div className="form-group mb-3">
                                <label>Meta Title</label>
                                <input type="text" name="meta_title" onChange={handleInput} value={categoryInput.meta_title} className='form-control' />
                            </div>
                            <div className="form-group mb-3">
                                <label>Meta Keyword</label>
                                <textarea name="meta_keyword" onChange={handleInput} value={categoryInput.meta_keyword} className='form-control' ></textarea>
                            </div>
                            <div className="form-group mb-3">
                                <label>Meta Desription</label>
                                <textarea name="meta_descrip" onChange={handleInput} value={categoryInput.meta_descrip} className='form-control' ></textarea>
                            </div>
                        </div>
                    </div>
                </div>

                <button type="submit" className="btn btn-primary px-4 float-end">Submit</button>
            </form>


        </div>
    )
}

export default Category