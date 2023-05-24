// import React from "react"

// export default function MenuItem(props) {
//     return(
//         <div className="w-100 m-2 border rounded-2">
//             <img src={props.img} alt="img-menu" className="w-100 img-fluid rounded-2 " style={{height: `400px`}}/>

//             <div className="w-100 mt-2 p-2">
//                 <h5 className="text-info mb-1">
//                     {props.nama_menu}
//                 </h5>

//                 <h6 className="fw-normal mb-1">
//                     {props.jenis}
//                 </h6>

//                 <p>
//                     {props.deskripsi}
//                 </p>

//                 <h5 className="text-success">
//                     Rp {props.harga}
//                 </h5>
//             </div>
//             <div className="w-100 p-2">
//                 <button className="btn btn-primary" onClick={() => props.onEdit()}>
//                     Edit
//                 </button>

//                 <buttton className="btn btn-danger mx-2" onClick={() => props.onDelete()}>
//                     Hapus
//                 </buttton>
//             </div>
//         </div>
//     )
// }

import React from 'react'
import './menu.css'

export default function MenuCard(props) {
    return (
        <div className='card mb-4 text-bg-light'>
            <div className="card-footer border-0">
                <img src={props.img} className="card-img-top" alt="img-menu"></img>
            </div>
            <div class="card-body">
                <h4 class="card-title fw-bold text-red-600 fst-italic">{props.nama_menu}</h4>
                <h6 className="card-text"><b>Deskripsi:</b> <small>{props.deskripsi}</small></h6>
                <h6 className="card-text"><b>Jenis:</b> {props.jenis}</h6>
                <small className="card-text"><b className='text-dark'>Harga: Rp.</b>{props.harga}</small>
            </div>
            <div className="card-footer p-3 d-flex justify-content-center border-0">
                <button className='btn btn-dark w-50 rounded-pill' onClick={() => props.onEdit()}>
                    Edit
                </button>
                <button className="btn btn-danger mx-1 w-50 rounded-pill" onClick={() => props.onDelete()}>
                    Delete
                </button>
            </div>
        </div>
    )
}