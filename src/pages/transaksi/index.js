
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal } from "bootstrap";

const baseURL = `http://localhost:8000`
const header = {
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
}

const Transaksi = () => {
    const [transaksi, setTransaksi] = useState([])
    const [menu, setMenu] = useState([])
    const [meja, setMeja] = useState([])

    const USER = JSON.parse(
        localStorage.getItem('user')
    )

    const [id_user, setIdUser] = useState(
        USER.id_user
    )

    const [tgl_transaksi, setTglTransaksi] = useState("")

    const [nama_pelanggan, setNamaPelanggan] = useState("")

    const [id_meja, setIdMeja] = useState("")

    const [detail_transaksi, setDetailTransaksi] = useState([])

    const [id_menu, setIdMenu] = useState("")

    const [jumlah, setJumlah] = useState(0)

    const [modal, setModal] = useState(null)

    const getMenu = () => {
        const url = `${baseURL}/menu`
        axios.get(url, header)
            .then(response => {
                setMenu(response.data.data)
            })
            .catch(error => console.log(error))
    }

    const getMeja = () => {
        const url = `${baseURL}/meja/avail`
        axios.get(url, header)
            .then(response => {
                setMeja(response.data.data)
            })
            .catch(error => console.log(error))
    }

    const getTransaksi = () => {
        const url = `${baseURL}/transaksi`
        axios.get(url, header)
            .then(response => {
                setTransaksi(response.data.data)
            })
            .catch(error => console.log(error))
    }

    const addMenu = () => {
        let selectedMenu = menu.find(
            item => item.id_menu == id_menu
        )

        let newItem = {
            ...selectedMenu,
            jumlah: jumlah
        }
        let tempDetail = [...detail_transaksi]
        tempDetail.push(newItem)

        setDetailTransaksi(tempDetail)

        setIdMenu("")
        setJumlah(0)
    }

    const handleSaveTransaksi = event => {
        event.preventDefault()
        if (nama_pelanggan === "" || id_meja === "" || detail_transaksi.length == 0) {
            window.alert(`please complete the form`)
        } else {
            const url = `${baseURL}/transaksi`
            const payload = {
                tgl_transaksi, id_meja, id_user, nama_pelanggan, detail_transaksi
            }
            axios.post(url, payload, header)
                .then(
                    response => {
                        window.alert(`data transaksi berhasil ditambahkan`)
                        modal.hide()
                        setTglTransaksi("")
                        setIdMeja("")
                        setIdMenu("")
                        setJumlah("")
                        setNamaPelanggan("")
                        setDetailTransaksi([])

                        getTransaksi()

                        getMeja()
                    }
                )
                .catch(
                    error => console.log(error)
                )
        }
    }

    const handleDelete = item => {
        if (window.confirm(`Apakah anda yakin ingin menghapus`)) {
            const url = `${baseURL}/transaksi/${item.id_transaksi}`
            axios.delete(url, header)
                .then(
                    response => getTransaksi()
                )
                .catch(
                    error => console.log(error)
                )
        }
    }

    const handlePay = item => {
        if (window.confirm(`Apakah anda yakin ingin membayar?`)) {
            const url = `${baseURL}/transaksi/${item.id_transaksi}`
            const payload = {
                ...item, status: "Lunas"
            }

            axios.put(url, payload, header)
                .then(response => getTransaksi(response))
                .catch(error => console.log(error))
        }
    }

    useEffect(() => {
        getTransaksi()
        getMeja()
        getMenu()

        // register modal
        setModal(new Modal(`#modal-transaksi`))

    }, [])

    return (
        <div className="w-100 container-fluid ">
            <h3>Data Transaksi</h3>


            <button className="btn btn-primary m-1 " onClick={() => modal.show()}>
                Transaksi Baru
            </button>

            <ul className="list-group">
                {transaksi.map((item, index) => (
                    <li className="list-group-item m-2" key={`tran${index}`}>
                        <div className="row">
                            <div className="col-md-2">
                                <small className="text-info">
                                    Tgl. Transaksi
                                </small> <br />
                                {item.tgl_transaksi}
                            </div>
                            <div className="col-md-3">
                                <small className="text-info">
                                    Nama Pelanggan
                                </small> <br />
                                {item.nama_pelanggan}
                            </div>
                            <div className="col-md-2">
                                <small className="text-info">
                                    No. Meja
                                </small> <br />
                                {item.meja.nomor_meja}
                            </div>
                            <div className="col-md-2">
                                <small className="text-info">
                                    Status
                                </small> <br />

                                <span className={`badge ${item.status === 'belum_bayar' ? 'bg-danger' : 'bg-success'}`}>
                                    {item.status}
                                </span>
                                <br />

                                {item.status === 'belum_bayar' ?
                                    <>
                                        <button className="btn btn-sm btn-info" onClick={() => handlePay(item)}>
                                            PAY
                                        </button>
                                    </>
                                    :
                                    <>

                                    </>}

                            </div>
                            <div className="col-md-2">
                                <small className="text-info">
                                    Total
                                </small><br />
                                {item
                                    .detail_transaksi
                                    .reduce((sum, obj) =>
                                        Number(sum) + (obj["jumlah"] * obj["harga"]), 0)

                                }
                            </div>
                            <div className="col-md-1">
                                <small className="text-info">
                                    Action
                                </small><br />

                                <button type="button" className="btn btn-sm btn-danger" onClick={() => handleDelete(item)}>
                                    <small className="bold">Hapus</small>
                                </button>



                            </div>

                        </div>

                        {/* list menu yang di pesan */}
                        <div className="row">
                            <h5 className="pt-3">Detail Pesanan :</h5>
                            <ul className="list-group">
                                {item.detail_transaksi.map((detail) => (
                                    <li className="list-group-item " key={`detail${item.id_transaksi}`}>

                                        <div className=" row">
                                            {/* nama pesanan */}
                                            <div className="col-md-3">
                                                <small className="text-success">menu</small> <br />
                                                {detail.menu.nama_menu}
                                            </div>

                                            {/* jumlah pesanan */}
                                            <div className="col-md-3">
                                                <small className="text-success">jumlah</small> <br />
                                                Qty: {detail.jumlah}
                                            </div>

                                            {/* harga satuan pesanan */}
                                            <div className="col-md-3">
                                                <small className="text-success">harga</small> <br />
                                                RP. {detail.harga}
                                            </div>

                                            {/* total */}
                                            <div className="col-md-3    ">
                                                <small className="text-success">total</small> <br />
                                                RP. {Number(detail.harga) * Number(detail.jumlah)}
                                            </div>
                                        </div>

                                    </li>
                                ))}
                            </ul>
                        </div>

                    </li>
                ))}
            </ul>


            {/* modal for add transaksi */}
            <div className="modal fade" id="modal-transaksi">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <form onSubmit={handleSaveTransaksi}>
                            <div className="modal-header">
                                <h4 className="modal-title">
                                    Form Transaksi
                                </h4>
                                <small>
                                    Tambahkan Pesanan Anda
                                </small>
                            </div>
                            <div className="modal-body">
                                {/* fill customer area */}
                                <div className="row">
                                    <div className="col-md-4">
                                        <small className="text-info">
                                            Nama Pelanggan
                                        </small>
                                        <input type="text" className="form-control mb-2"
                                            value={nama_pelanggan}
                                            onChange={
                                                e => setNamaPelanggan(e.target.value)
                                            } />
                                    </div>
                                    <div className="col-md-4">
                                        <small className="text-info">
                                            Pilih Meja
                                        </small>
                                        <select className="form-control mb-2"
                                            value={id_meja}
                                            onChange={
                                                e => setIdMeja(e.target.value)}>
                                            <option value="">--Pilih Meja--</option>
                                            {meja.map(table => (
                                                <option value={table.id_meja}
                                                    key={`keyMeja${table.id_meja}`} >

                                                    Nomor Meja {table.nomor_meja}
                                                </option>
                                            ))}

                                        </select>
                                    </div>
                                    <div className="col-md-4">
                                        <small className="text-info">
                                            Tgl.transaksi
                                        </small>

                                        <input type="date" className="form-control mb-2"
                                            value={tgl_transaksi}
                                            onChange={
                                                e => setTglTransaksi(e.target.value)
                                            } />
                                    </div>

                                </div>
                                {/* choose menu area */}
                                <div className="row">
                                    <div className="col-md-8">
                                        <small className="text-info">
                                            Pilih Menu
                                        </small>
                                        <select className="form-control mb-2 " value={id_menu}
                                            onChange={e => setIdMenu(e.target.value)}>

                                            <option value="">Pilih Menu</option>
                                            {menu.map((item, index) => (
                                                <option value={item.id_menu} key={`keyMenu${index}`}>

                                                    {item.nama_menu}

                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-md-2">
                                        <small className="text-info">
                                            Jumlah
                                        </small>
                                        <input type="number" className="form-control mb-2" value={jumlah}
                                            onChange={e => setJumlah(e.target.value)} />


                                    </div>

                                    <div className=" col-md-2">
                                        <small className="text-info">
                                            Action
                                        </small> <br />
                                        <button type="button" className="btn btn-sm btn-success" onClick={() => addMenu()}>
                                            ADD
                                        </button>
                                    </div>
                                </div>
                                {/* detail order area */}
                                <div className="row">
                                    <h5 className="pt-3">Detail Pesanan :</h5>
                                    <ul className="list-group">
                                        {detail_transaksi.map((detail) => (
                                            <li className="list-group-item" key={`detail${detail.id_menu}`}>

                                                <div className=" row">
                                                    {/* nama pesanan */}
                                                    <div className="col-md-3">
                                                        <small className="text-success">menu</small> <br />
                                                        {detail.nama_menu}
                                                    </div>

                                                    {/* jumlah pesanan */}
                                                    <div className="col-md-3">
                                                        <small className="text-success">jumlah</small> <br />
                                                        Qty: {detail.jumlah}
                                                    </div>

                                                    {/* harga satuan pesanan */}
                                                    <div className="col-md-3">
                                                        <small className="text-success">harga</small> <br />
                                                        RP. {detail.harga}
                                                    </div>

                                                    {/* total */}
                                                    <div className="col-md-3    ">
                                                        <small className="text-success">total</small> <br />
                                                        RP. {Number(detail.harga) * Number(detail.jumlah)}
                                                    </div>
                                                </div>

                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <button type="submit" className="w-100 btn btn-success my-2">
                                    Simpan
                                </button>

                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Transaksi